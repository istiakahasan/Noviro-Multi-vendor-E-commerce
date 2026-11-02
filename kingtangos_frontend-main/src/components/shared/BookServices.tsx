/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
// import BookingModal from "./BookingModal"
import {
  useGetAllCategoryQuery,
  useGetAllServiceByCategoryIdQuery,
} from "@/redux/api/servicesApi";
import { Category, ServiceItem } from "@/types/CategoryItem.type";
// import { Category, ServiceItem } from "@/types/categoryItem.type";

export interface GetAllCategoriesResponse {
  data: Category[];
}

export default function BookServices() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)

  // Fetch all categories
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetAllCategoryQuery("");
  const categories: Category[] = categoriesResponse?.data || [];

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Fetch services by active category
  const {
    data: servicesResponse,
    isLoading: servicesLoading,
    error,
  } = useGetAllServiceByCategoryIdQuery(activeCategory, {
    skip: !activeCategory,
  });
  const services: ServiceItem[] = servicesResponse?.data || [];

  // Scroll left/right
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Open booking modal
  // const handleBookClick = (service: ServiceItem) => {
  //   setSelectedService(service)
  //   setIsModalOpen(true)
  // }
  // Close booking modal
  // const handleCloseModal = () => {
  //   setIsModalOpen(false)
  //   setSelectedService(null)
  // }

  // Format price
  const formatPrice = (price: number) => `$${price}`;

  // Get category name
  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.name ||
      "Unknown Category"
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Services</h1>

      {/* Category Filter */}
      <div className="relative flex items-center gap-2">
        {categoriesLoading ? (
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-24 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((category: Category) => (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-lg",
                    activeCategory === category.id
                      ? "bg-primary text-foreground"
                      : "bg-background",
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hidden shrink-0 md:flex"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden shrink-0 md:flex"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Service Cards */}
      <div className="space-y-4">
        {servicesLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="flex items-center justify-between p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
            </Card>
          ))
        ) : error ? (
          <Card className="p-4 text-center">
            <p className="text-red-600">Failed to load services</p>
          </Card>
        ) : services.length === 0 ? (
          <Card className="p-4 text-center">
            <p className="text-muted-foreground">
              No services found for {getCategoryName(activeCategory)}
            </p>
          </Card>
        ) : (
          services.map((service: ServiceItem) => (
            <Card
              key={service.id}
              className="flex items-center justify-between p-4 transition-shadow hover:shadow-md"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{service.name}</h3>
                <p className="text- text-muted-foreground">
                  {service.duration}
                </p>
                <p className="text-sm font-medium">
                  {formatPrice(service.price)}
                </p>
                {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {service.description}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="shrink-0 bg-transparent"
                // onClick={() => handleBookClick(service)}
              >
                Book
              </Button>
            </Card>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {/* <BookingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      /> */}
    </div>
  );
}
