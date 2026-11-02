import TopImg1 from "@/assets/images/t1.png";
import TopImg2 from "@/assets/images/t2.png";
import TopImg3 from "@/assets/images/t3.png";
import { StaticImageData } from "next/image";





export type AccommodationItem = {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  ratingCount: number;
  subtitle: string;
  image: string | StaticImageData;
};

export const accommodations: AccommodationItem[] = [
  {
    id: 1,
    title: "Home Decor",
    price: 35,
    oldPrice: 40,
    discount: "10% off",
    rating: 4.8,
    ratingCount: 42,
    subtitle: "Biggest sale in 60+ days",
    image: TopImg1,
  },
  {
    id: 2,
    title: "Home Decor",
    price: 35,
    oldPrice: 40,
    discount: "10% off",
    rating: 4.8,
    ratingCount: 42,
    subtitle: "Biggest sale in 60+ days",
    image: TopImg2,
  },
  {
    id: 3,
    title: "Activewear",
    price: 35,
    oldPrice: 40,
    discount: "10% off",
    rating: 4.8,
    ratingCount: 42,
    subtitle: "Biggest sale in 60+ days",
    image: TopImg3,
  },
];