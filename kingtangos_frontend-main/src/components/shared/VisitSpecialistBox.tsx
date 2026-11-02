"use client"
import { useState } from "react"

type VisitOption = "yes" | "no" | null

export default function VisitSpecialistBox() {
    const [selected, setSelected] = useState<VisitOption>("yes")
    return (
        <div className="w-full mx-auto py-8">
            {/* Heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-8">
                Is this your first visit to Daol Salon - Aseana?
            </h1>

            {/* Options Container */}
            <div className="space-y-4">
                {/* Yes Option */}
                <button
                    onClick={() => setSelected("yes")}
                    className={`w-full text-left transition-all duration-200 ${selected === "yes"
                            ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                            : "border-2 border-gray-300 bg-gray-50 dark:bg-gray-900/30 hover:border-gray-400"
                        } rounded-xl p-4 md:p-6`}
                >
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg md:text-xl font-semibold text-primary">Yes</h2>
                        <p className="text-sm md:text-base text-muted-foreground">This is my first visit</p>
                    </div>
                </button>

                {/* No Option */}
                <button
                    onClick={() => setSelected("no")}
                    className={`w-full text-left transition-all duration-200 ${selected === "no"
                            ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                            : "border-2 border-gray-300 bg-gray-50 dark:bg-gray-900/30 hover:border-gray-400"
                        } rounded-xl p-4 md:p-6`}
                >
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg md:text-xl font-semibold text-primary">No</h2>
                        <p className="text-sm md:text-base text-muted-foreground">Ive visited before</p>
                    </div>
                </button>
            </div>
        </div>
    )
}
