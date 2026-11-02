// import React from "react";

// const Certifications = () => {
//   const languages = ["English", "Spanish"];
//   const certs = [
//     "Licensed Cosmetologist",
//     "Advanced Color Theory Certificate",
//     "Keratin Treatment Specialist",
//   ];

//   return (
//     <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
//       <h3 className="font-semibold text-gray-900 mb-4">
//         Certifications & Experience
//       </h3>
//       <div className="text-sm text-gray-700 space-y-3">
//         <p className="flex flex-col">
//           <span className="font-medium">Experience:</span> 8+ years
//         </p>
//         <div>
//           <span className="font-medium">Languages:</span>
//           <div className="flex gap-2 mt-1">
//             {languages.map((lang) => (
//               <span
//                 key={lang}
//                 className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 text-xs"
//               >
//                 {lang}
//               </span>
//             ))}
//           </div>
//         </div>
//         <div>
//           <span className="font-medium">Certifications:</span>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {certs.map((cert) => (
//               <span
//                 key={cert}
//                 className="px-3 py-1 bg-gray-100 rounded-md text-xs border border-gray-200"
//               >
//                 {cert}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Certifications;


import React from "react";
import { SpecialistProfile } from "@/lib/api/myProfile/settingsApi";

interface CertificationsProps {
  profile: SpecialistProfile;
}

const Certifications = ({ profile }: CertificationsProps) => {
  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">
        Experience & Details
      </h3>
      <div className="text-sm text-gray-700 space-y-3">
        <p className="flex flex-col">
          <span className="font-medium">Experience:</span>
          {profile.experience}
        </p>
        <p className="flex flex-col">
          <span className="font-medium">Title:</span>
          {profile.title}
        </p>
        <p className="flex flex-col">
          <span className="font-medium">Service Type:</span>
          <span className="capitalize">{profile.serviceType.name}</span>
        </p>
        <p className="flex flex-col">
          <span className="font-medium">Available Time:</span>
          <span className="capitalize">{profile.specialistTime}</span>
        </p>
        <p className="flex gap-4">
          <span className="font-medium">Status:</span>
          <span className={`inline-flex px-3 w-fit py-1 rounded-full text-xs font-medium ${
            profile.available 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-gray-700"
          }`}>
            {profile.available ? "Available" : "Unavailable"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Certifications;