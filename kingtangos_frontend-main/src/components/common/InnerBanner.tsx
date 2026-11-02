import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import AnimationProvider from "../providers/AnimationProvider";

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

const InnerBanner = ({
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
      <div className="relative lg:flex">
        <div className="md:flex flex-col md:flex-row w-full ">
          {/* LEFT: text over background image */}
          <div
            className="relative lg:h-[488px] h-[400px] w-full md:rounded-l-lg md:rounded-t-none rounded-t-lg flex items-center justify-center p-6 lg:p-8 text-white bg-cover bg-center"
            style={{ backgroundImage: `url(${leftBgSrc})` }}
          >
            <div className="relative z-10">
              <AnimationProvider animation="fade-up" duration={0.7}>
                <h1
                  className={`md:text-3xl text-2xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight transition-all duration-500 text-center `}
                >
                  {titleBlack}
                  <br />
                  <span className="text-orange-500">{titleOrange}</span>
                </h1>
              </AnimationProvider>
              <AnimationProvider animation="fade-up" duration={0.9}>
                <p
                  className={`text-gray-600 lg:text-lg md:text-base text-sm mb-8 leading-relaxed transition-all duration-500 delay-100 text-center px-2 lg:px-0`}
                >
                  {description}
                </p>
              </AnimationProvider>
              <AnimationProvider animation="fade-up" duration={1}>
                <div className="flex justify-center">
                  {buttonText && (
                    <Link href={buttonLink} className="flex justify-center">
                      <Button className="bg-black text-white hover:bg-gray-800 text-sm lg:text-base">
                        {buttonText}
                      </Button>
                    </Link>
                  )}
                </div>
              </AnimationProvider>
            </div>
          </div>

          {/* RIGHT: only image */}
          <div className="lg:h-[488px] h-[400px] w-full ">
            <Image
              src={rightImgSrc}
              alt={rightImgAlt}
              width={500}
              height={488}
              className="h-full w-full object-cover  md:rounded-l-none rounded-b-lg md:rounded-r-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerBanner;
