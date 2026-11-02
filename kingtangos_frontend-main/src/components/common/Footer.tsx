"use client";

import {
  FaTiktok,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiLoopLeftFill } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

type FormValues = {
  email: string;
};

export default function Footer() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Email submit:", data.email);
      toast.success("Subscribed successfully");
      reset();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const onError = () => {
    const msg =
      errors.email?.message || "Please provide a valid email address.";
    toast.error(msg as string);
  };

  return (
    <footer className="bg-white text-gray-700">
      <div className="">
        <div className=" bg-[#F9F9F9]/50">
          <div className="container mx-auto px-4 py-6 flex justify-center md:justify-end">
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="flex w-full max-w-xl items-center"
              noValidate
            >
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full rounded-l-md border border-neutral-200 px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
                aria-invalid={!!errors.email || undefined}
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email.",
                  },
                })}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="whitespace-nowrap rounded-r-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-70"
              >
                Sign Up Now
              </button>
            </form>
          </div>
        </div>

        {/* Top Info Bar */}
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-sm border-b border-gray-200">
          <div className="flex items-center gap-3">
            <LiaShippingFastSolid className="text-2xl" />
            <div className="text-left">
              <p className="font-medium">Free Shipping</p>
              <p>On All Orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RiLoopLeftFill className="text-2xl" />
            <div className="text-left">
              <p className="font-medium">30-Day Return</p>
              <p>Returns within 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BsBoxSeam className="text-2xl" />
            <div className="text-left">
              <p className="font-medium">Delivery Guarantee</p>
              <p>Safe & Reliable</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CiLock className="text-2xl" />
            <div className="text-left">
              <p className="font-medium">Secure Checkout</p>
              <p>Payment & Privacy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="font-medium">Expert Customer Service</p>
              <p>24/7 Friendly Support Team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold text-black">Noviro</h2>
          <p className="text-sm mt-3">
            <span className="font-semibold">Noviro:</span> Multi vendor
            ecommerce website. We provide a platform for sellers to showcase
            their products and for customers to find unique items. Our mission
            is to create a seamless shopping experience while supporting small
            businesses and artisans worldwide.
          </p>
          <p className="text-sm mt-2 text-gray-600">
            noviro.com is a multi-vendor ecommerce website that connects buyers
            and sellers from around the world. We provide a platform for small
            businesses and artisans to showcase their products, while offering
            customers a wide variety of unique items. Our mission is to create a
            seamless shopping experience that supports small businesses and
            promotes global commerce.
          </p>
          <div className="flex space-x-4 mt-16 text-xl">
            <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer">
              <FaTiktok />
            </div>
            <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer">
              <FaFacebookF />
            </div>
            <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer">
              <FaInstagram />
            </div>
            <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer">
              <FaXTwitter />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-black">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <Link href="/privacy-policy">
              <li className="cursor-pointer hover:underline ">
                Privacy Policy
              </li>
            </Link>
            <Link href="/terms-conditions">
              <li className="cursor-pointer hover:underline">
                Terms & Conditions
              </li>
            </Link>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold mb-3 text-black">Customer Service</h3>
          <ul className="space-y-5 text-sm">
            <li>Contact: info@ainoviro.com</li>
            <Link href="/refund-policy">
              <li className="cursor-pointer hover:underline">Refund Policy</li>
            </Link>
            {/* <li>Track Order</li> */}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-semibold mb-3 text-black">Contact Us</h3>
          <button className="border px-6 py-2 border-gray-400 rounded-full text-sm flex items-center gap-2 text-black">
            <MessageSquare className="w-4 h-4" />
            Customer Service
          </button>
          <div className="mt-6 text-sm">
            <p className="font-semibold text-base text-black">Service Time</p>
            <p>24-hour Monday through Sunday</p>
          </div>
          {/* <div className="mt-6 text-sm">
            <p className="font-semibold text-base text-black">Address:</p>
            <p>Cyprus</p>
            <p>Corona, California 92879 USA</p>
          </div> */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className=" container border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        Copyright © 2025 Noviro.com All Rights Reserved.
      </div>
    </footer>
  );
}
