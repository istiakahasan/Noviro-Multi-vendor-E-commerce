
// import React from "react";

// const BasicInfo = () => {
//   return (
//     <div className=" rounded-2xl p-6 shadow-sm border border-gray-100">
//       <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
//       <div className="text-[16px] text-gray-700 space-y-4">
//         <div className="flex justify-between">
//           <p className="flex flex-col text-gray-800">
//             <span className="font-thin">Email:</span>{" "}
//             sarah.johnson@beautystudio.com
//           </p>
//           <p className="flex flex-col text-gray-800">
//             <span className="font-thin">Phone:</span> +1 (555) 123-4567
//           </p>
//         </div>
//         <p className="flex flex-col text-gray-800">
//           <span className="font-thin  ">Location:</span> Downtown Beauty Studio,
//           Seattle, WA
//         </p>
//         <p className="flex flex-col text-gray-800">
//           <span className="font-thin">Bio:</span> Passionate beauty
//           professional with over 8 years of experience in hair styling, color
//           consultation, and skincare. I specialize in helping clients discover
//           their unique style and feel confident in their own skin.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default BasicInfo;



import React from "react";
import { SpecialistProfile } from "@/lib/api/myProfile/settingsApi";

interface BasicInfoProps {
  profile: SpecialistProfile;
}

const BasicInfo = ({ profile }: BasicInfoProps) => {
  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
      <div className="text-[16px] text-gray-700 space-y-4">
        <div className="flex justify-between">
          <p className="flex flex-col text-gray-800">
            <span className="font-thin">Email:</span>
            {profile.email}
          </p>
          <p className="flex flex-col text-gray-800">
            <span className="font-thin">Phone:</span>
            {profile.phoneNum}
          </p>
        </div>
        <p className="flex flex-col text-gray-800">
          <span className="font-thin">Location:</span>
          {profile.store.name}, {profile.store.location}
        </p>
        <p className="flex flex-col text-gray-800">
          <span className="font-thin">Gender:</span>
          <span className="capitalize">{profile.gender.toLowerCase()}</span>
        </p>
        <p className="flex flex-col text-gray-800">
          <span className="font-thin">Bio:</span>
          {profile.bio}
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;