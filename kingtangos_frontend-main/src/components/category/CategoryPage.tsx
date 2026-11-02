"use client";
import TrustedBy from "@/components/home/TrustedBy";
import {
  useCategoriesQuery,
  useGetProductByCategoryIdQuery,
} from "@/redux/api/categoryApi";
import { useParams } from "next/navigation";
import React from "react";
import TopDeals from "@/components/shared/category/TopDeals";
import NewArrivals from "@/components/shared/category/NewArrivals";
import BestService from "@/components/shared/category/BestService";
import Consultant from "@/components/shared/category/Consultant";
import Subscription from "../shared/category/Subscription";
import CustomBanner from "../common/CustomBanner";
import PageLoading from "../shared/PageLoading";

// Define the banner configuration for each category
const categoryBannerConfig: Record<
  string,
  {
    titleBlack: string;
    titleOrange: string;
    description: string;
    buttonText?: string;
    buttonLink: string;
    leftBgSrc: string;
    rightImgSrc: string;
    rightImgAlt: string;
  }
> = {
  "Retail & Fashion": {
    titleBlack: "Discover Style,",
    titleOrange: "Define Your Fashion",
    description:
      "Explore the latest trends in clothing, footwear, and accessories from top brands and designers.",
    buttonText: "Shop Now",
    buttonLink: "/product",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/HWQhv0cf/f1b5915c4dff3cffd97b3ed1c79c9aa04448f28b.jpg",
    rightImgAlt: "fashion model",
  },
  "Food & Events": {
    titleBlack: "Taste Perfection,",
    titleOrange: "Celebrate Moments",
    description:
      "From gourmet meals to event catering, find everything you need for memorable dining experiences.",
    buttonText: "Order Now",
    buttonLink: "/product",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/ZnRvNF1R/c245848727d00ed31fbfff453603182c1cbe7c46.jpg",
    rightImgAlt: "food presentation",
  },
  "Tech & Automotive": {
    titleBlack: "Innovate & Drive,",
    titleOrange: "Future Ready",
    description:
      "Cutting-edge technology, electronics, and automotive solutions for modern living.",
    buttonText: "Explore Tech",
    buttonLink: "/product",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/6pL694mH/1b5d2b0c1debdb027c1f4344c05824795fa6622c.jpg",
    rightImgAlt: "tech gadgets",
  },
  "Home & Pets": {
    titleBlack: "Comfort & Care,",
    titleOrange: "Home Sweet Home",
    description:
      "Everything for your home and furry friends - from furniture to pet essentials.",
    buttonText: "Shop Home",
    buttonLink: "/product",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/63DT7JLm/e36b3f982e2a5e5905b632ac28dc2c7e8ed2c815.jpg",
    rightImgAlt: "home decor",
  },
  "Personal Care & Wellness": {
    titleBlack: "Nurture Yourself,",
    titleOrange: "Radiate Wellness",
    description:
      "Premium beauty, skincare, and wellness products for your personal care routine.",
    buttonText: "Book Now",
    buttonLink: "/service",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/T3S03h5p/56b3e468ba2fff684e9e4d9420e177e06e5cf8fc.jpg",
    rightImgAlt: "wellness",
  },
  "Business & Industry": {
    titleBlack: "Scale Your Business,",
    titleOrange: "Industry Solutions",
    description:
      "Professional services, consulting, and enterprise solutions for business growth.",
    buttonText: "Hire Consultant",
    buttonLink: "/consultation",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/nrGZn6dD/97fde557d6a45f967d57bec6ebea4ebca7c14a20.jpg",
    rightImgAlt: "business consultant",
  },
  "Property, Accommodation & Hospitality": {
    titleBlack: "Find Your Space,",
    titleOrange: "Perfect Stay",
    description:
      "Real estate, rentals, hotels and property management services tailored for you.",
    buttonText: "Browse Properties",
    buttonLink: "/consultation",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/DZ3tmx4G/7c47e4ffd0fee1daae66d0720c2d95af56b7dcfc.jpg",
    rightImgAlt: "property",
  },
  // Default fallback configuration
  default: {
    titleBlack: "Search Anything,",
    titleOrange: "Find Everything",
    description:
      "Discover a world of amazing products and services from trusted vendors, all in one place.",
    buttonText: "Explore",
    buttonLink: "/",
    leftBgSrc: "https://i.postimg.cc/kXf03P3W/Frame-2147227518.png",
    rightImgSrc:
      "https://i.postimg.cc/RhFG0td3/2126bb60e6d68300959ed1568d5475ad5d71f389.jpg",
    rightImgAlt: "products and services",
  },
};

export default function CategoryPage() {
  const { id } = useParams();
  const { data: categoryByIdData } = useGetProductByCategoryIdQuery(
    id as string,
    {
      skip: !id,
    },
  );

  const { data: allCategoriesData } = useCategoriesQuery(undefined);

  // Find the current category from the categories list
  const currentCategory = allCategoriesData?.data?.find((cat) => cat.id === id);
  const categoryName = currentCategory?.name || "";

  // Get banner configuration based on category name
  const bannerConfig =
    categoryBannerConfig[categoryName] || categoryBannerConfig.default;

  const topDealsProducts = categoryByIdData?.data?.topDealProducts || [];
  const newArrivalProducts = categoryByIdData?.data?.newlyAddedProducts || [];
  const bestService = categoryByIdData?.data?.bestServices || [];
  const takeConsultant = categoryByIdData?.data?.consultantServices || [];
  const subscriptionData = categoryByIdData?.data?.Subscription || [];

  const hasCategoryData =
    topDealsProducts.length > 0 ||
    newArrivalProducts.length > 0 ||
    bestService.length > 0 ||
    takeConsultant.length > 0 ||
    subscriptionData.length > 0;

  if (!id) return <PageLoading />;

  return (
    <div className="md:container pb-16 pt-16 mx-auto">
      <CustomBanner
        titleBlack={bannerConfig.titleBlack}
        titleOrange={bannerConfig.titleOrange}
        description={bannerConfig.description}
        buttonText={bannerConfig.buttonText}
        buttonLink={bannerConfig.buttonLink}
        leftBgSrc={bannerConfig.leftBgSrc}
        rightImgSrc={bannerConfig.rightImgSrc}
        rightImgAlt={bannerConfig.rightImgAlt}
      />

      <div>
        {hasCategoryData ? (
          <>
            <TopDeals topDeals={topDealsProducts} />
            <NewArrivals newArrival={newArrivalProducts} />
            <BestService bestService={bestService} />
            <Consultant consultant={takeConsultant} />
            <Subscription subscription={subscriptionData} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No category available!
            </p>
          </div>
        )}

        <TrustedBy />
      </div>
    </div>
  );
}
