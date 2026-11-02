// import { Button } from "@/components/ui/button";
// import { XCircle } from "lucide-react";
// import Link from "next/link";

// export default function AccessDenied() {
//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
//       <div className="flex max-w-md flex-col items-center text-center">
//         <div className="flex justify-center">
//           <iframe
//             className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px]" // ← increased size here
//             src="https://lottie.host/embed/14854140-9268-4a5a-9312-23cda2369c8b/QaEIpFaDvT.lottie"
//           ></iframe>
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
//         <p className="text-gray-600 mb-8">
//           You do not have permission to access this page. If you believe this is
//           an error, please contact your administrator.
//         </p>
//         <div className="flex gap-4">
//           <Link href="/">
//             <Button variant="default">Go to Dashboard</Button>
//           </Link>
//           <Link href="/login">
//             <Button variant="outline">Login as different user</Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }



import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="w-full text-center flex flex-col items-center gap-6">
        {/* Animation */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square">
          <iframe
            className="w-full h-full"
            src="https://lottie.host/embed/14854140-9268-4a5a-9312-23cda2369c8b/QaEIpFaDvT.lottie"
          />
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Access Denied
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            You do not have permission to access this page. If you believe this
            is a mistake, please contact your administrator.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Login as different user
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
