// import React from "react";
// import { Star } from "lucide-react";
// import Image from "next/image";
// import { CiLocationOn } from "react-icons/ci";

// const ProfileHeader = () => {
//   return (
//     <div className="shadow-sm rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100">
//       <Image
//         src="https://i.ibb.co.com/PyXSVMn/Ellipse-3.png"
//         alt="Profile"
//         width={80}
//         height={80}
//         className="rounded-full object-cover"
//       />
//       <h2 className="mt-3 text-lg font-semibold">John</h2>
//       <p className="text-sm text-purple-500">
//         Hair Stylist & Beauty Consultant
//       </p>

//       <div className="flex items-center justify-center mt-2 text-sm text-gray-500 gap-2">
//         <Star className="w-4 h-4 text-yellow-400" />
//         <span>4.8</span>
//         <CiLocationOn />
//         <span>Seattle, WA</span>
//       </div>

//       <div className="flex justify-between w-full mt-7  border-gray-100 pt-4 text-sm font-medium">
//         <div>
//           <p className="text-lg font-semibold">156</p>
//           <p className="text-gray-500">Total Clients</p>
//         </div>
//         <div>
//           <p className="text-lg font-semibold">342</p>
//           <p className="text-gray-500">Sessions</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileHeader;

import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { SpecialistProfile } from "@/lib/api/myProfile/settingsApi";

interface ProfileHeaderProps {
  profile: SpecialistProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const profileImage = profile.user.profilePic || "https://i.ibb.co.com/PyXSVMn/Ellipse-3.png";

  return (
    <div className="shadow-sm rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100">
      
      <div className="w-40 h-40">
        <img
                  src={profileImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-full"
                />
        </div>
      <h2 className="mt-3 text-lg font-semibold">{fullName}</h2>
      <p className="text-sm text-purple-500 capitalize">
        {profile.serviceType.name} Specialist
      </p>

      <div className="flex items-center justify-center mt-2 text-sm text-gray-500 gap-2">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span>{profile.averageRating.toFixed(1)}</span>
        <CiLocationOn />
        <span>{profile.store.location}</span>
      </div>

      <div className="flex justify-between w-full mt-7 border-gray-100 pt-4 text-sm font-medium">
        <div>
          <p className="text-lg font-semibold">{profile.totalReviews}</p>
          <p className="text-gray-500">Total Reviews</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{profile.rating}</p>
          <p className="text-gray-500">Rating</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;