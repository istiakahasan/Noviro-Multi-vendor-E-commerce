import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import errorImg from '@/assets/images/error.png'
import warning from '@/assets/images/warning.png'
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
      <div className="space-y-6 max-w-md">
        {/* <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          404 - Page Not Found
        </h1> */}

        {/* <p className="text-xl text-muted-foreground">
          We&apos;re working on this page. Please check back later or return to
          the homepage.
        </p> */}

        <div className="flex">
          <Image src={errorImg} height={804} width={878} alt="" />
        </div>

        {/* <iframe
          className="w-full max-w-sm mx-auto h-64 md:h-80"
          src="https://lottie.host/embed/9a0ea178-1368-4057-a575-e8c6e921499a/FzDqBHrNXn.lottie"
        ></iframe> */}

        <h2 className="text-2xl font-semibold text-primary">Ooops’s!</h2>
        <div className="flex justify-center w-full items-center gap-3">
          <Image src={warning} alt="" height={36} width={36} />
          <p className="text-primary text-lg text-center">This Page can t Be Found</p>
        </div>
        <p className="text-center text-primary">Sorry, we couldnt tind the page you where looking for. We suggest that you return to homepage.</p>
        <Button asChild className="mt-8">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
