/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
// import { Toaster } from "sonner";
import x from "@/assets/x.png"
import y from "@/assets/y.png"
import z from "@/assets/z.png"

type Logo = {
  id: number;
  name: string;
  src: any;
};

const logos: Logo[] = [
  { id: 1, name: "Vox Media", src: x },
  { id: 2, name: "HGTV", src: y },
  { id: 3, name: "The New York Times", src: z },
  { id: 4, name: "HomeTalk", src: y },
  { id: 5, name: "Good Housekeeping", src: x },
  { id: 6, name: "HEARS", src: z },
  { id: 7, name: "Benzinga", src: x },
  { id: 8, name: "Townhall Finance", src: y },
  { id: 9, name: "Daily Herald", src: z },
  { id: 10, name: "News Channel Nebraska", src: x },
  { id: 11, name: "FOX40", src: y },
  { id: 12, name: "Financial Content", src: z },
];


export default function TrustedBy() {
  const firstRow = logos.slice(0, 6);
  const secondRow = logos.slice(6, 12);



  return (
    <section className="w-full py-12 md:py-16 bg-neutral-50">
      {/* sonner toaster (does not affect layout/design) */}
      {/* <Toaster richColors position="top-right" /> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-neutral-900">
            Trust By World Best
          </h2>

          {/* Row 1 */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4  sm:gap-6 md:gap-8">
              {firstRow.map((logo) => (
                <div
                  key={logo.id}
                  className="flex h-14 sm:h-16 items-center justify-center lg:border-r last:border-0"
                >
                  <Image
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.name}
                    width={120}
                    height={60}
                    className="h-full w-auto object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
              {secondRow.map((logo) => (
                <div
                  key={logo.id}
                  className="flex h-14 sm:h-16 items-center justify-center lg:border-r last:border-0"
                >
                  <Image
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.name}
                    width={120}
                    height={60}
                    className="h-full w-auto object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
