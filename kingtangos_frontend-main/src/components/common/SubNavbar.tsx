"use client";

import Link from "next/link";
import { MdEmail } from "react-icons/md";

export default function SubNavbar() {


  return (
    <div className="w-full bg-neutral-800 text-neutral-200 text-[11px] md:text-xs py-2">
      {/* thin top bar */}
      <div className="mx-auto container px-3">
        <div className="flex items-center justify-between gap-3 py-1.5">
          {/* Left cluster */}
          <div className="flex min-w-0 items-center gap-4 overflow-hidden">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <MdEmail className="size-4 opacity-80" />
              <a
                href="mailto:example934@gmail.com"
                className="hover:text-white transition-colors"
              >
                info@ainoviro.com
              </a>
            </div>
            {/* <div className="hidden sm:flex items-center gap-2 min-w-0">
              <MdLocationOn className="size-4 opacity-80 shrink-0" />
              <span className="truncate">Cyprus</span>
            </div> */}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <Link
              href="https://seller.dashboard.ainoviro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline hover:text-white"
            >
              BECOME A SELLER
            </Link>
            <Link
              href="https://specialist.dashboard.ainoviro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline hover:text-white"
            >
              BECOME A SPECIALIST
            </Link>
            {/* <Link
              href="https://user.dashboard.ainoviro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline hover:text-white"
            >
              BECOME A USER
            </Link> */}
          </div>
        </div>
      </div>

      {/* mobile overflow helper: shows hidden actions in a horizontal list */}
      <div className="sm:hidden border-t border-neutral-700/70">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1.5 text-[11px] [scrollbar-width:none] [-ms-overflow-style:none]">
            <Link href="https://seller.dashboard.ainoviro.com" className="whitespace-nowrap hover:text-white">
              BECOME A SELLER
            </Link>
            <span className="opacity-40">•</span>
            <Link href="https://specialist.dashboard.ainoviro.com" className="whitespace-nowrap hover:text-white">
              BECOME A SPECIALIST
            </Link>
            {/* <Link href="#" className="whitespace-nowrap hover:text-white">
              BECOME A USER
            </Link> */}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
