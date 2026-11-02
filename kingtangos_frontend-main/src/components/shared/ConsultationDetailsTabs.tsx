import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import ReviewProduct from "./review/ReviewProduct"
import Image from "next/image";
import {
  AvailableProvider,
  Consultation,
} from "@/types/consultationDetails.type";
import ConsultationReview from "./review/ConsultationReview";
import { ConsultationReviewResponse } from "@/types/consultationReview.type";
import { SpecialistReviewsResponse } from "@/types/specialistReview.type";
import SpecialistReview from "./review/SpecialistReview";

interface ConsultationProps {
  consultation: Consultation | undefined;
  onSelectSpecialist: (provider: AvailableProvider) => void;
  reviews?: ConsultationReviewResponse;
  consultationId?: string;
  specialistId?: string;
  specialistReviews?: SpecialistReviewsResponse;
  type?: string;
  selectedSpecialist?: AvailableProvider | null;
}

export default function ConsultationDetailsTabs({
  consultation,
  onSelectSpecialist,
  reviews,
  consultationId,
  specialistId,
  specialistReviews,
  selectedSpecialist,
}: ConsultationProps) {
  const consultant = consultation;
  const specialists = consultant?.specialists ?? [];
  const providers = consultation?.availableProviders ?? [];


  return (
    <div className="md:container mx-auto py-10 md:px-0 px-2">
      <Tabs defaultValue="tab-1" className="items-start">
        <TabsList className="h-auto gap-2 rounded-none border-b border-primary/20 w-full justify-start bg-transparent px-0 py-1 text-foreground">
          <TabsTrigger
            value="tab-1"
            className="relative text-base text-primary after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-primary/80 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:hover:bg-accent"
          >
            Info
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="relative text-base text-primary after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-primary/80 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:hover:bg-accent"
          >
            Experience
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="relative text-base text-primary after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-primary/80 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:hover:bg-accent"
          >
            Review
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-10 my-5">
            <div>
              <h2 className="lg:text-2xl md:text-xl text-lg font-semibold text-primary">
                About Consultant
              </h2>
              <p className="text-text md:text-base text-sm mt-2.5">{consultation?.description}</p>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => onSelectSpecialist(provider)}
                    className="border rounded-xl cursor-pointer my-5 p-5 flex flex-col items-center justify-center"
                  >
                    <Image
                      src={provider.profilePic || "/default.png"}
                      width={71}
                      height={71}
                      className="rounded-full w-20 h-20 object-cover"
                      alt={`${provider.name}`}
                    />
                    <h3 className="font-semibold text-primary text-lg">
                      {provider.name}
                    </h3>
                    <p className="">{provider.type}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div>
                <h2 className="lg:text-2xl md:text-xl text-lg font-semibold text-primary">
                  At a Glance
                </h2>
                {/* <div className="flex items-center gap-3 mt-2.5 text-text">
                                    <BiSolidVideo className="text-xl" />
                                    <p>Instant Consultation Time</p>
                                </div>
                                <p className="text-primary font-semibold my-3">  <span className="text-text font-normal ml-1">(10 AM - 11 PM)</span></p> */}

                {/* <div className="flex items-center gap-3 mt-5 text-text ">
                                    <FaCalendarAlt className="text-xl" />
                                    <p>Instant Consultation Time</p>
                                </div>
                                <p className="text-primary font-semibold my-3">Sat - Fri  <span className="text-text font-normal ml-1">(10 AM - 11 PM)</span></p> */}
              </div>
              <div className="max-w-md flex justify-between">
                <div>
                  <div>
                    <p className="text-text mt-2.5">Consultation Fee</p>
                    <h3 className="lg:text-2xl md:text-xl text-lg font-semibold text-primary">
                      ${consultant?.price}
                    </h3>
                  </div>
                  <div>
                    <p className="text-text mt-2.5">Patient Attended</p>
                    <h3 className="lg:text-2xl  md:text-xl text-lg font-semibold text-primary ">
                      1545

                    </h3>
                  </div>
                  <div>
                    <p className="text-text mt-2.5">Duration Time</p>
                    <h3 className="lg:text-2xl  md:text-xl text-lg font-semibold text-primary ">
                      {consultant?.slotDuration} Min
                    </h3>
                  </div>
                </div>

                <div>
                  {/* <div>
                                        <p className="text-text">Follow-Up Fee</p>
                                        <h3 className="text-2xl font-semibold text-primary mt-2.5">$34.90</h3>
                                    </div>
                                    <div>
                                        <p className="text-text">Joined Noviro</p>
                                        <h3 className="text-2xl font-semibold text-primary mt-2.5">24 Oct 2024</h3>
                                    </div>
                                    <div>
                                        <p className="text-text">Consultant Code</p>
                                        <h3 className="text-2xl font-semibold text-primary mt-2.5">1245r2</h3>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
          <SpecialistReview
            consultationId={consultationId || ""}
            specialistId={specialistId || ""}
            specialistReviews={specialistReviews}
            type={selectedSpecialist?.type || "consultation"}
          />
        </TabsContent>
        <TabsContent value="tab-2" className="w-full">
          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-10 my-5">
            <div>
              {/* <h2 className="text-2xl font-semibold text-primary">Harvard University</h2> */}

              {specialists.slice(1).map((experience) => (
                <>
                  <div className="grid grid-cols-2 gap-10 items-center mt-12 ">
                    <div>
                      <p className="text-text">Designation</p>
                      <h3 className="font-semibold text-primary mt-2.5">
                        {experience?.title}
                      </h3>
                    </div>

                    <div>
                      <p className="text-text">Department</p>
                      <h3 className="font-semibold text-primary mt-2.5">
                        {consultant?.description}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 items-center mt-12 ">
                    {/* <div>
                                                <p className="text-text">Employment Status</p>
                                                <h3 className="font-semibold text-primary mt-2.5">Feb 1, 2008 - current</h3>
                                            </div> */}
                    <div>
                      <p className="text-text">Experience</p>
                      <h3 className="font-semibold text-primary mt-2.5">
                        {experience.experience}
                      </h3>
                    </div>

                    {/* <div>
                                                <p className="text-text">Period</p>
                                                <h3 className="font-semibold text-primary mt-2.5">17 Years</h3>
                                            </div> */}
                  </div>
                </>
              ))}
            </div>
            {/* <div>
                            <h2 className="text-2xl font-semibold text-primary">Globe Economy</h2>

                            <div className="grid grid-cols-2 gap-10 items-center mt-12 ">
                                <div>
                                    <p className="text-text">Designation</p>
                                    <h3 className="font-semibold text-primary mt-2.5">CEO</h3>
                                </div>

                                <div>
                                    <p className="text-text">Department</p>
                                    <h3 className="font-semibold text-primary mt-2.5">Economy and Business</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10 items-center mt-12 ">
                                <div>
                                    <p className="text-text">Employment Status</p>
                                    <h3 className="font-semibold text-primary mt-2.5">Feb 1, 2010 - current</h3>
                                </div>

                                <div>
                                    <p className="text-text">Period</p>
                                    <h3 className="font-semibold text-primary mt-2.5">15 Years</h3>
                                </div>
                            </div>
                        </div> */}
          </div>
        </TabsContent>
        <TabsContent value="tab-3">
          <ConsultationReview
            consultationId={consultationId || ""}
            reviews={reviews}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
