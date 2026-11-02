import React from "react";
import { Clock } from "lucide-react";

const services = [
  {
    title: "Hair Consultation",
    desc: "Comprehensive hair analysis and styling recommendations",
    type: "consultation",
  },
  {
    title: "Color Consultation",
    desc: "Professional color matching and technique advice",
    type: "consultation",
  },
  {
    title: "Hair Styling Session",
    desc: "Complete hair styling service including wash, cut, and style",
    type: "service",
  },
  {
    title: "Beauty Consultation",
    desc: "Skincare and makeup consultation for all skin types",
    type: "consultation",
  },
];

const MyServices = () => {
  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className=" text-gray-900 mb-4">My Services</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.title}
            className="p-4 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h4 className=" text-gray-900">
                {service.title}
              </h4>
              <span
                className={`text-xs  px-2 py-1 rounded-xl ${
                  service.type === "service"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {service.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{service.desc}</p>
            <div className="flex items-center gap-1 text-gray-400 text-xs mt-3">
              <Clock className="w-3 h-3" />
              <span>60 min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyServices;
