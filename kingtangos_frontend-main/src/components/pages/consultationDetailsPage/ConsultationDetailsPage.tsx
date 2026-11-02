"use client";
import Image from "next/image";
import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConsultationDetailsTabs from "@/components/shared/ConsultationDetailsTabs";
import { useParams, useRouter } from "next/navigation";
import {
  useGetConsultationDetailsQuery,
  useGetConsultationReviewsQuery,
  // useGetConsultationReviewsQuery,
} from "@/redux/api/consultationsApi";
import { useEffect, useState } from "react";
import { AvailableProvider } from "@/types/consultationDetails.type";
import { useGetSpecialistReviewsQuery } from "@/redux/api/specialistReviewApi";
import { useAuth } from "@/redux/hooks/useAuth";

export default function ConsultationDetailsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { id } = useParams();

  const { data } = useGetConsultationDetailsQuery(id as string);

  const consultation = data?.data;
  const consultationId = consultation?.id;



  const { data: reviews } = useGetConsultationReviewsQuery(consultationId!, {
    skip: !consultationId,
  });

  const [selectedSpecialist, setSelectedSpecialist] =
    useState<AvailableProvider | null>(null);

  const specialistId = selectedSpecialist?.specialistId || "";

    const consultationDtailsPageUrl = `/consultation/${id}/${selectedSpecialist?.id}`;

  const handleClick = () => {
    if (!isAuthenticated) {
      // redirect to login with return url
      router.push(
        `/login?redirect=${encodeURIComponent(consultationDtailsPageUrl)}`,
      );
    } else {
      router.push(consultationDtailsPageUrl);
    }
  };

  // In your ConsultationDetailsPage component
  const { data: specialistReviews } = useGetSpecialistReviewsQuery(
    {
      specialistId: specialistId,
      type: "consultation", // Pass the type from selected specialist
    },
    { skip: !specialistId || !selectedSpecialist?.type },
  );

  // 👇 Default: select 1st specialist when data loads
  useEffect(() => {
    const providers = consultation?.availableProviders ?? [];
    if (providers.length > 0) {
      setSelectedSpecialist(providers[0]);
    }
  }, [consultation?.availableProviders]);

  return (
    <div className="bg-background">
      <section className="w-full bg-gray-100 py-8 lg:px-8 md:px-4">
        <div className="mx-auto md:container md:px-0 px-2 mt-7">
          <div className="flex flex-col gap-6 md:flex-col lg:flex-row lg:items-start lg:gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative h-[500px] w-full overflow-hidden rounded-lg border-2 border-white lg:w-80">
                <Image
                  src={selectedSpecialist?.profilePic || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex flex-1 flex-col gap-6">
              <div>
                <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  {selectedSpecialist?.name}
                </h1>
                <p className="mt-2 text-sm text-gray-600 md:text-base">
                  {selectedSpecialist?.type}
                </p>
                {selectedSpecialist?.title && (
                  <Badge
                    className="mt-3 bg-orange-500 w-fit text-white pr-12 py-2 hover:bg-orange-600"
                    style={{
                      clipPath:
                        "polygon(0 0, 90% 0, 75% 50%, 90% 100%, 0 100%)",
                    }}
                  >
                    {selectedSpecialist.title}
                  </Badge>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className=" p-4">
                  <p className="text-xs text-gray-500 sm:text-sm">Experience</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 sm:text-lg">
                    {selectedSpecialist?.totalExperience}
                  </p>
                </div>
                <div className=" p-4">
                  <p className="text-xs text-gray-500 sm:text-sm">
                    Consultation Mode
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900 sm:text-lg">
                    {consultation?.consultationMode}
                  </p>
                </div>
                {selectedSpecialist?.rating ||
                selectedSpecialist?.totalReviews ? (
                  <div className="p-4">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Total Rating
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-base font-semibold text-gray-900 sm:text-lg">
                        {Number(selectedSpecialist?.rating) >= 5
                          ? "5.0"
                          : Number(selectedSpecialist?.rating || 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({selectedSpecialist?.totalReviews || 0})
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Consultation Fee & Booking */}
            <div className="flex flex-col gap-4 lg:min-w-[240px]">
              <div className="text-right">
                <p className="text-sm text-gray-600">Consultation Fee</p>
                <p className="mt-1 lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">
                  ${consultation?.price}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {/* <Link href={`/consultation/${id}/${selectedSpecialist?.id}`}> */}
                <Button
                  onClick={handleClick}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book an appointment
                </Button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>

        <ConsultationDetailsTabs
          consultation={consultation}
          consultationId={consultationId}
          reviews={reviews}
          specialistId={specialistId}
          specialistReviews={specialistReviews}
          selectedSpecialist={selectedSpecialist}
          onSelectSpecialist={(provider: AvailableProvider) =>
            setSelectedSpecialist(provider)
          }
        />
      </section>
    </div>
  );
}
