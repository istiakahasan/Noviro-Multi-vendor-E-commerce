import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"


import Image from "next/image"
import { Consultation, Specialist } from "@/types/consultationTypes";
import ReviewProduct from "./ReviewProduct";

interface ConsultationProps {
    consultation: Consultation | undefined;
    onSelectSpecialist: (specialist: Specialist) => void;
}

export default function ConsultationDetailsTabs({ consultation, onSelectSpecialist }: ConsultationProps) {

    const consultant = consultation;
    const specialists = consultation?.specialists ?? [];

    return (
        <div className='container mx-auto py-10'>

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
                            <h2 className="text-2xl font-semibold text-primary">About Consultant</h2>
                            <p className="text-text mt-2.5">{consultation?.description}</p>
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
                                {specialists.map((specialist) => (
                                    <div
                                        key={specialist.id}
                                        onClick={() => onSelectSpecialist(specialist)}
                                        className="border rounded-xl cursor-pointer my-5 p-5 flex flex-col items-center justify-center">
                                        <Image
                                            src={specialist.user?.profilePic || "/default.png"}
                                            width={71}
                                            height={71}
                                            className="rounded-full"
                                            alt={`${specialist.firstName} ${specialist.lastName}`}
                                        />
                                        <h3 className="font-semibold text-primary text-lg">{specialist.firstName} {specialist.lastName}</h3>
                                        <p className="">{specialist.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div>
                                <h2 className="text-2xl font-semibold text-primary">At a Glance</h2>
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
                                        <h3 className="text-2xl font-semibold text-primary">€ {consultant?.price}</h3>
                                    </div>
                                    <div>
                                        <p className="text-text mt-2.5">Patient Attended</p>
                                        <h3 className="text-2xl font-semibold text-primary ">1545</h3>
                                    </div>
                                    <div>
                                        <p className="text-text mt-2.5">Duration Time</p>
                                        <h3 className="text-2xl font-semibold text-primary ">{consultant?.slotDuration} Min</h3>
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
                </TabsContent>
                <TabsContent value="tab-2" className="w-full">
                    <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-10 my-5">
                        <div>
                            {/* <h2 className="text-2xl font-semibold text-primary">Harvard University</h2> */}

                            {
                                specialists.slice(1).map((experience) => (
                                    <>
                                        <div className="grid grid-cols-2 gap-10 items-center mt-12 ">
                                            <div>
                                                <p className="text-text">Designation</p>
                                                <h3 className="font-semibold text-primary mt-2.5">{experience?.title}</h3>
                                            </div>

                                            <div>
                                                <p className="text-text">Department</p>
                                                <h3 className="font-semibold text-primary mt-2.5">{consultant?.description}</h3>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-10 items-center mt-12 ">
                                            {/* <div>
                                                <p className="text-text">Employment Status</p>
                                                <h3 className="font-semibold text-primary mt-2.5">Feb 1, 2008 - current</h3>
                                            </div> */}
                                            <div>
                                                <p className="text-text">Experience</p>
                                                <h3 className="font-semibold text-primary mt-2.5">{experience.experience}</h3>
                                            </div>

                                            {/* <div>
                                                <p className="text-text">Period</p>
                                                <h3 className="font-semibold text-primary mt-2.5">17 Years</h3>
                                            </div> */}
                                        </div>
                                    </>
                                ))
                            }
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
                    <ReviewProduct />
                </TabsContent>
            </Tabs>

        </div>
    )
}
