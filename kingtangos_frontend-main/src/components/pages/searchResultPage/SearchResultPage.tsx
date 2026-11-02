/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PageLoading from "@/components/shared/PageLoading";
import { Card } from "@/components/ui/card";
import { useGetSearchProductsQuery } from "@/redux/api/productsApi";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AiFillStar } from "react-icons/ai";
import { IoStar } from "react-icons/io5";

export default function SearchResultPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";

    const { data, isLoading, isError } = useGetSearchProductsQuery(
        { q },
        { skip: !q }
    );

    if (isLoading) return <PageLoading />;
    if (isError) return <div>Something went wrong</div>;

    const { products = [], services = [], consultations = [], plans = [] } = data?.results || {};

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-lg font-medium mb-4">
                Search results for “{q}”
            </h1>

            {/* PRODUCTS */}
            {products?.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold mb-2">Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product: any, idx) => (
                            <Link href={`/product/${product.id}`} key={product.id}>
                                <div

                                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                                >
                                    <div className="relative h-48 w-full bg-gray-100">
                                        <Image
                                            src={product.Image || ""}
                                            alt={product.name}
                                            width={500}
                                            height={500}
                                            className="h-full w-full object-cover rounded-lg"
                                            loading={idx < 4 ? "eager" : "lazy"}
                                        />


                                        {/* <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                            <div className="pointer-events-auto mb-3 w-full px-3">

                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                                                    Add To Cart
                                                </button>

                                            </div>
                                        </div> */}
                                        
                                    </div>

                                    <div className="space-y-2">
                                        {/* Rating */}
                                        <div className="flex items-center justify-between gap-1">
                                            <h3 className="font-medium mt-2 truncate">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5">
                                                <IoStar className="fill-yellow-400 text-yellow-400" />
                                                <div>
                                                    <span>{product.averageRating}</span>
                                                    <span className="text-gray-500">
                                                        ({product.totalReviews})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <span className="font-semibold">
                                                € {product?.finalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">

                                            {product?.discount > 0 && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    € {(product.price).toFixed(2)}
                                                </span>
                                            )}

                                            <div className="bg-primary px-3 text-white py-1 w-fit rounded-full">
                                                <p>{product.discount}% off</p>
                                            </div>
                                        </div>



                                        {product?.discount > 0 && (
                                            <p className="text-xs text-gray-600">
                                                Biggest sale in 60+ days
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* SERVICES */}
            {services?.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold mb-2">Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {services.map((service: any, idx) => (
                            <Link href={`/service/${service.id}`} key={service.id}>
                                <div
                                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                                >

                                    <div className="relative h-48 w-full bg-gray-100">
                                        <Image
                                            src={service?.profilePic || "/placeholder.svg"}
                                            alt={service?.name}
                                            width={500}
                                            height={500}
                                            className="h-full w-full object-cover rounded-lg"
                                            loading={idx < 4 ? "eager" : "lazy"}
                                        />
                                        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                            <div className="pointer-events-auto mb-3 w-full px-3">
                                                <Link href={`/service/${service.id}`} key={service.id}>
                                                    <button
                                                        className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900 transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="space-y-2">
                                        {/* Rating */}
                                        <div className="gap-1">
                                            <h3 className="font-medium mt-3 truncate">
                                                {service.name}
                                            </h3>
                                            <div className="flex items-center pt-2 gap-1.5">
                                                <IoStar className="fill-yellow-400 text-yellow-400" />
                                                <div>
                                                    <span>{service.averageRating}</span>
                                                    <span className="text-gray-500">
                                                        ({service.totalReviews})
                                                    </span>
                                                </div>
                                            </div>

                                            <p className='py-3'>{service.location}</p>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                                € {service.price}
                                            </span>
                                        </div>

                                        {/* Sale message */}
                                        {service.discount > 0 && (
                                            <p className="text-xs text-gray-600">
                                                Biggest sale in 60+ days
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}


            {/* CONSULTATIONS */}
            {consultations?.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Consultations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {consultations.map((consultation, idx) => (
                            <Link
                                key={consultation.id}
                                href={`/consultation/${consultation.id}`}
                                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                            >

                                <div className="relative h-48 w-full bg-gray-100">
                                    <Image
                                        src={consultation?.profilePic || "/placeholder.svg"}
                                        alt={consultation?.name}
                                        width={500}
                                        height={500}
                                        className="h-full w-full object-cover rounded-lg"
                                        loading={idx < 4 ? "eager" : "lazy"}
                                    />
                                    <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <div className="pointer-events-auto mb-3 w-full px-3">
                                            <Link
                                                key={consultation.id}
                                                href={`/consultation/${consultation.id}`}>
                                                <button
                                                    className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="gap-1">
                                        <h3 className="font-medium pt-3 truncate">
                                            {consultation.name}
                                        </h3>

                                        <div className="flex items-center pt-2 gap-1.5">
                                            <IoStar className="fill-yellow-400 text-yellow-400" />
                                            <span>{consultation.averageRating}</span>
                                            <span className="text-gray-500">
                                                ({consultation.totalReviews})
                                            </span>
                                        </div>

                                        <p className="py-1 text-sm text-gray-500">{consultation.location}</p>
                                    </div>

                                    <div className="flex items-center gap-2 font-semibold">
                                        € {consultation.price}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Subscription */}
            {plans?.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Subscription</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {plans.map((subscription, idx) => (
                            <Link href={`/subscription/${subscription.id}`} key={subscription.id}>
                                <Card

                                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    {/* Image + Hover overlay (unchanged) */}
                                    <div className="relative h-48 w-full bg-gray-100">
                                        <Image
                                            src={subscription.image}
                                            alt={subscription.planName || ""}
                                            width={500}
                                            height={500}
                                            className="h-full w-full object-cover rounded-lg"
                                            loading={idx < 4 ? "eager" : "lazy"}
                                        />

                                        {/* Hover gradient + button (like the first card in your screenshot) */}
                                        {/* <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <div className="pointer-events-auto mb-3 w-full px-3">
                                <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                                  Add To Cart
                                </button>
                              </div>
                            </div> */}
                                    </div>

                                    {/* Body */}
                                    <div className="p-5">
                                        {/* Title */}
                                        <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                                            {subscription.planName}
                                        </h3>

                                        {/* Rating */}
                                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                            <AiFillStar className="text-yellow-600 text-sm" />
                                            <span>{subscription.averageRating}</span>
                                            <span>({subscription.totalReviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="mt-3 text-[15px] font-semibold text-gray-800">
                                            <span>EUR</span> {subscription.amount}/month
                                        </div>

                                        {/* Feature list */}
                                        <ul className="mt-3 space-y-2">
                                            {subscription.features.map((f: any, i: any) => (
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
                                </Card>
                            </Link>
                        ))}
                    </div>
                </>
            )}



            { !products?.length && !services?.length && !consultations?.length && !! plans?.length && (
                <p>No results found</p>
            )}
        </div>
    );
}
