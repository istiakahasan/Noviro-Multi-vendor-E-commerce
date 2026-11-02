"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

import React from "react";
import Image from "next/image";
import { CircleCheckBig, Star } from "lucide-react";
import { IoLocationSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import {
  useGetAllStoreProductQuery,
  useGetStoreByProductQuery,
} from "@/redux/api/store.Api";

import SendMessageButton from "@/components/common/SentMessageButton";

export default function StorePage() {
  const [, setIsCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const categoriesRef = useRef<HTMLDivElement>(null);

  const { id, storeProfileId } = useParams();

  const { data } = useGetAllStoreProductQuery(id as string);
  const { data: storeProduct } = useGetStoreByProductQuery(
    storeProfileId as string,
  );

  const products = storeProduct?.data?.products || [];
  const services = storeProduct?.data?.services || [];
  const consultations = storeProduct?.data?.consultations || [];
  const subscriptions = storeProduct?.data?.plans || [];

  const store = data?.data?.stores?.[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/product", label: "PRODUCT" },
    { href: "/service", label: "SERVICE" },
    { href: "/consultation", label: "CONSULTATION" },
    { href: "/subscription", label: "SUBSCRIPTION" },
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto">
        <Image
          src={store?.banner || "/fallback-banner.png"}
          alt=""
          className="h-96"
          height={377}
          width={1420}
        />
        <div className="flex md:flex-row flex-col items-center gap-9 py-10">
          <Image
            src={store?.logo || "/logo.png"}
            alt=""
            height={200}
            width={200}
          />
          <div className="flex flex-col md:items-start items-center">
            <h1 className="lg:text-4xl text-3xl font-semibold text-primary">
              {store?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm my-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="font-medium text-primary">150 Reviews</span>
              <div>
                <span className="text-muted-foreground">⚡</span>
                <span className="text-muted-foreground text-primary">
                  178 sold in last 10 days
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <IoLocationSharp className="lg:text-2xl text-7xl text-primary/60" />
              <p className="lg:w-7/12 text-primary/60">{store?.location}</p>
            </div>

            {store?.userId && (
              <SendMessageButton
                receiverId={store.userId}
                userType="Client"
                nextUrl={`/user/chat`}
              />
            )}

            {/* <Link href="/user/chat">
              <Button className="flex items-center gap-1.5 bg-white h-11 hover:bg-white/80 rounded-xl shadow-sm mt-3">
                <BiMessageRounded className="size-5 text-primary/90" />
                <p className="text-primary text-base">Sent message to seller</p>
              </Button>
            </Link> */}
          </div>
        </div>

        {/* Navlink */}
        <div className="w-full px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1.5 px-4 text-sm font-medium rounded-full transition-colors ${
                    pathname === link.href
                      ? "text-gray-900 border border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-md">
              <div className="relative w-full">
                <button
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-10">
          {/* product */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Our Best Product</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.slice(0, 8).map((d, idx) => (
                <article
                  key={d.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                >
                  {/* Image + Hover overlay */}
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={d.image}
                      alt={d.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover rounded-lg"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />

                    {/* Hover gradient + button (like the first card in your screenshot) */}
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="pointer-events-auto mb-3 w-full px-3">
                        <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-4 pb-4 pt-3">
                    {/* Title + rating */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        {d.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-base text-gray-600">
                        <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                        {d.averageRating.toFixed(1)}({d.totalReviews})
                      </span>
                    </div>

                    {/* Price row */}
                    <div className="mb-8 flex items-center gap-3">
                      <div className="text-lg font-semibold">
                        € {d.finalPrice}
                      </div>
                      <div className="text-base text-gray-400 line-through">
                        EUR-{d.price}
                      </div>
                      <span className="rounded-full bg-gray-900 px-2 py-0.5 text-base font-medium text-white">
                        {d.discount}
                      </span>
                    </div>

                    {/* Subtitle */}
                    {/* <p className="text-sm font-bold text-gray-800">{d.description}</p> */}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* service */}
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Our Best Services</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.slice(0, 4).map((d, idx) => (
                <article
                  key={d.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                >
                  {/* Image + Hover overlay */}
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={d?.profilePic || ""}
                      alt={d?.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover rounded-lg"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />

                    {/* Hover gradient + button (like the first card in your screenshot) */}
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="pointer-events-auto mb-3 w-full px-3">
                        <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-4 pb-4 pt-3">
                    {/* Title + rating */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        {d?.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-base text-gray-600">
                        <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                        {d?.averageRating.toFixed(1)}({d.totalReviews})
                      </span>
                    </div>

                    <p>{d.location}</p>

                    {/* Price row */}
                    <div className="mb-8 flex items-center gap-3">
                      <div className="text-lg font-semibold">€ {d.price}</div>
                      {/* <div className="text-base text-gray-400 line-through">
                                                €-{d.oldPrice}
                                            </div>
                                            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-base font-medium text-white">
                                                {d.discount}
                                            </span> */}
                    </div>

                    {/* Subtitle */}
                    {/* <p className="text-sm font-bold text-gray-800">{d.description}</p> */}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* consultant */}
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Our Best Consultant</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {consultations.slice(0, 4).map((d, idx) => (
                <article
                  key={d.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                >
                  {/* Image + Hover overlay */}
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={d.profilePic || ""}
                      alt={d.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover rounded-lg"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />

                    {/* Hover gradient + button (like the first card in your screenshot) */}
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="pointer-events-auto mb-3 w-full px-3">
                        <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-4 pb-4 pt-3">
                    {/* Title + rating */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        {d.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-base text-gray-600">
                        <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                        {d.averageRating.toFixed(1)}({d.totalReviews})
                      </span>
                    </div>

                    <p>{d.location}</p>

                    {/* Price row */}
                    <div className="mb-8 flex items-center gap-3">
                      <div className="text-lg font-semibold">€ {d.price}</div>
                      {/* <div className="text-base text-gray-400 line-through">
                                                USD-
                                            </div>
                                            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-base font-medium text-white">
                                                
                                            </span> */}
                    </div>

                    {/* Subtitle */}
                    {/* <p className="text-sm font-bold text-gray-800">{d.description}</p> */}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* subscription */}
          <div className="mt-10">
            {/* Header */}
            <h2 className="text-2xl font-semibold  mb-6">
              Our Subscription Plan
            </h2>
            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subscriptions.slice(0, 4).map((p) => (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-40 w-full sm:h-44">
                    <Image
                      src={p.image}
                      alt={p.planName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                      {p.planName}
                    </h3>

                    {/* Rating */}
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <AiFillStar className="text-yellow-600 text-sm" />
                      <span>{p.averageRating.toFixed(1)}</span>
                      <span>({p.totalReviews})</span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 text-[15px] font-semibold text-gray-800">
                      EUR {p.amount.toFixed(2)}/month
                    </div>

                    {/* Feature list */}
                    <ul className="mt-3 space-y-2">
                      {p.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px] text-gray-600"
                        >
                          <CircleCheckBig className="mt-[1px] shrink-0 text-blue-400 w-4 h-4" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <button
                      type="button"
                      className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-semibold text-white transition hover:bg-primary/75"
                    >
                      Get Started
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
