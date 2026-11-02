import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface PageBannerProps {
  titleBlack: string; // first part of the title (black)
  titleOrange: string; // second part of the title (orange)
  description: string;
  buttonText?: string;
  buttonLink?: string;

  /** Left side background image (behind text) */
  leftBgSrc: string;

  /** Right side foreground image (only image) */
  rightImgSrc: string;
  rightImgAlt: string;
}

const PageBanner = ({
  titleBlack,
  titleOrange,
  description,
  buttonText = "Book Now",
  buttonLink = "#",
  leftBgSrc,
  rightImgSrc,
  rightImgAlt,
}: PageBannerProps) => {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="relative flex overflow-hidden rounded-l-lg">
        <div className="w-[1100px] h-[488px] flex">
          {/* LEFT: text over background image */}
          <div
            className="relative h-[488px] w-[550px] flex flex-col justify-center p-6 lg:p-8 text-white bg-cover bg-center"
            style={{ backgroundImage: `url(${leftBgSrc})` }}
          >
            <div className="relative z-10">
              <h1 className="text-2xl lg:text-5xl font-semibold mb-2 text-center leading-snug">
                <span className="text-black">{titleBlack}</span>
                <span className="text-orange-500 block">{titleOrange}</span>
              </h1>

              <p className="text-sm lg:text-base mb-4 max-w-md text-center text-gray-500">
                {description}
              </p>

              {buttonText && (
                <Link href={buttonLink} className="flex justify-center">
                  <Button className="bg-black text-white hover:bg-gray-800 text-sm lg:text-base">
                    {buttonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT: only image */}
          <div className="h-[488px] w-[550px]">
            <Image
              src={rightImgSrc}
              alt={rightImgAlt}
              width={550}
              height={488}
              className="h-full w-full object-cover  rounded-r-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
