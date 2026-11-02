import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/**
 * Captures an HTML element and saves it as a PDF in A4 format with padding.
 * Automatically splits content across multiple pages if needed.
 * @param elementId The ID of the HTML element to capture.
 * @param fileName The name of the PDF file to save.
 */
export const downloadPDF = async (
  elementId: string,
  fileName: string = "report.pdf",
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  try {
    // Generate PNG image using html-to-image
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      style: {
        backgroundColor: "#ffffff",
        padding: "20px", // Internal padding
      },
    });

    const img = new Image();
    img.src = dataUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Get image dimensions in pixels
    const imgWidthPx = img.width;
    const imgHeightPx = img.height;

    // A4 dimensions in mm
    const a4WidthMm = 210;
    const a4HeightMm = 297;

    // Padding in mm (20mm on all sides)
    const paddingMm = 20;

    // Content area (A4 minus padding)
    const contentWidthMm = a4WidthMm - paddingMm * 2;
    const contentHeightMm = a4HeightMm - paddingMm * 2;

    // Calculate how the image will be scaled to fit the content width
    // The image width will be scaled to contentWidthMm
    const scaleFactor = contentWidthMm / imgWidthPx; // mm per pixel
    const scaledImageHeightMm = imgHeightPx * scaleFactor;

    // Calculate how many pages we need
    const totalPages = Math.ceil(scaledImageHeightMm / contentHeightMm);

    // Create PDF with standard A4 format
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Process each page
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      if (pageNum > 0) {
        pdf.addPage();
      }

      // Calculate which portion of the scaled image goes on this page
      const pageStartMm = pageNum * contentHeightMm;
      const pageEndMm = Math.min(
        (pageNum + 1) * contentHeightMm,
        scaledImageHeightMm,
      );
      const pageHeightMm = pageEndMm - pageStartMm;

      // Convert back to pixels to know which part of the original image to extract
      const sourceStartY = pageStartMm / scaleFactor;
      const sourceEndY = pageEndMm / scaleFactor;
      const sourceHeight = sourceEndY - sourceStartY;

      // Create a canvas for this page's content
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas to exact size of the image portion we're extracting
      canvas.width = imgWidthPx;
      canvas.height = sourceHeight;

      // Fill with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the portion of the image for this page
      ctx.drawImage(
        img,
        0,
        sourceStartY, // source x, y - where to start reading from the original image
        imgWidthPx,
        sourceHeight, // source width, height - how much to read
        0,
        0, // destination x, y - where to place on canvas
        imgWidthPx,
        sourceHeight, // destination width, height - size on canvas (no scaling here)
      );

      // Convert canvas to data URL
      const pageDataUrl = canvas.toDataURL("image/png", 1.0);

      // Add image to PDF with padding
      pdf.addImage(
        pageDataUrl,
        "PNG",
        paddingMm, // x position (left padding)
        paddingMm, // y position (top padding)
        contentWidthMm, // width in mm
        pageHeightMm, // height in mm (maintains aspect ratio)
      );
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
