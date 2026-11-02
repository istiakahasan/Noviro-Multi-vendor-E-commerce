"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BannerImg from "@/assets/images/banner.png";
import Slider1 from "@/assets/images/banner1.png";
import Link from "next/link";

const bannerSlides = [
  {
    id: 1,
    title: "Search Anything,",
    subtitle: "Find Everything",
    description:
      "Discover a world of amazing products and services from trusted vendors, all in one place.",
    buttonText: <Link href={"/top-deals"}>Shop Now</Link>,
    image: Slider1,
  },
  {
    id: 2,
    title: "Explore More,",
    subtitle: "Discover Better",
    description:
      "Find the perfect products tailored to your needs with our advanced search and filtering system.",
    buttonText: <Link href={"/product"}>Explore Now</Link>,
    image: Slider1,
  },
  // {
  //   id: 3,
  //   title: "Quality First,",
  //   subtitle: "Always Trusted",
  //   description:
  //     "We partner with verified vendors to ensure you get only the highest quality products and services.",
  //   buttonText: "Learn More",
  //   image: Slider1,
  // },
  // {
  //   id: 4,
  //   title: "Fast Delivery,",
  //   subtitle: "Reliable Service",
  //   description:
  //     "Get your orders delivered quickly and safely with our trusted logistics partners worldwide.",
  //   buttonText: "Order Now",
  //   image: Slider1,
  // },
];

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % bannerSlides.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = bannerSlides[activeIndex];

  return (
    <div className="md:container mx-auto -mt-11">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200">
        <div className="transition-all duration-500 ease-in-out">
          <div className="">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* Left Side with Background */}
              <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
                {/* Background image */}
                <div className="absolute inset-0 -z-10">
                  <Image
                    src={BannerImg}
                    alt="Banner background"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                  {/* <div className="absolute inset-0 bg-white/70 rounded-l-2xl" /> */}
                  {/* Optional overlay for readability */}
                </div>

                {/* Text content */}
                <div className="max-w-lg mx-auto relative ">
                  <h1
                    className={`text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight transition-all duration-500 text-center ${
                      isTransitioning
                        ? "opacity-0 translate-y-4"
                        : "opacity-100 translate-y-0"
                    }`}
                  >
                    {currentSlide.title}
                    <br />
                    <span className="text-orange-500">
                      {currentSlide.subtitle}
                    </span>
                  </h1>
                  <p
                    className={`text-gray-600 lg:text-lg text-base mb-8 leading-relaxed transition-all duration-500 delay-100 text-center px-2 lg:px-0 ${
                      isTransitioning
                        ? "opacity-0 translate-y-4"
                        : "opacity-100 translate-y-0"
                    }`}
                  >
                    {currentSlide.description}
                  </p>
                  <div className="flex justify-center">
                    <button
                      className={`bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-500 delay-200 ${
                        isTransitioning
                          ? "opacity-0 translate-y-4"
                          : "opacity-100 translate-y-0"
                      }`}
                    >
                      {currentSlide.buttonText}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Image */}
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src={currentSlide.image || "/placeholder.svg"}
                  alt={`Banner slide ${currentSlide.id}`}
                  width={500}
                  height={500}
                  className={`w-full h-full object-cover object-center transition-all duration-500 ${
                    isTransitioning
                      ? "opacity-0 scale-105"
                      : "opacity-100 scale-100"
                  }`}
                  priority={activeIndex === 0}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                index === activeIndex
                  ? "bg-gray-800 w-8"
                  : "bg-gray-400 w-2.5 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
