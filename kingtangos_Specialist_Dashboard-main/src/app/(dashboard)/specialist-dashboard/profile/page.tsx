
// "use client";

// import Link from "next/link";
// import { FaRegEdit } from "react-icons/fa";
// import BasicInfo from "./components/BasicInfo";
// import Certifications from "./components/Certifications";
// import MyServices from "./components/MyServices";
// import ProfileHeader from "./components/ProfileHeader";
// import WeeklyAvailability from "./components/WeeklyAvailability";
// import { useGetMyProfileQuery } from "@/lib/api/myProfile/settingsApi";
// const ProfilePage = () => {

//   const {data, isLoading, isError} = useGetMyProfileQuery();

//   console.log(data);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   if (isError) {
//     return <div>failed to load profile</div>;
//   }

//   return (
//     <div className="max-w-7xl min-h-[calc(100vh-150px)] mx-auto px-6 py-8 space-y-8">
//       <div className="flex justify-between items-center">
//         {/* Page Header */}
//         <div>
//           <h1 className="text-[24px] font-semibold text-gray-900">
//             My Profile
//           </h1>
//           <p className="text-base text-[#4A5565]">
//             Manage your professional profile and settings
//           </p>
//         </div>

//         <Link
//           href="/specialist-dashboard/profile/edit"
//           className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 flex gap-2 items-center "
//         >
//           <FaRegEdit size={20} /> Edit Profile
//         </Link>
//       </div>

//       {/* Profile Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] items-start gap-6">
//         <ProfileHeader />
//         <div className="space-y-6">
//           <BasicInfo />
//           <Certifications />
//         </div>
//       </div>

//       {/* Weekly Availability */}
//       <WeeklyAvailability />

//       {/* My Services */}
//       <MyServices />
//     </div>
//   );
// };

// export default ProfilePage;



"use client";

import { useGetMyProfileQuery } from "@/lib/api/myProfile/settingsApi";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import BasicInfo from "./components/BasicInfo";
import Certifications from "./components/Certifications";
import ProfileHeader from "./components/ProfileHeader";
import WeeklyAvailability from "./components/WeeklyAvailability";
import PageLoading from "@/components/ui/Loading";

const ProfilePage = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery();

  console.log(data);

  if (isLoading) {
    return (
      <PageLoading/>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <div className="text-lg text-red-600">Failed to load profile</div>
      </div>
    );
  }

  const profile = data.data;

  return (
    <div className="max-w-7xl min-h-[calc(100vh-150px)] mx-auto px-6 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold text-gray-900">
            My Profile
          </h1>
          <p className="text-base text-[#4A5565]">
            Manage your professional profile and settings
          </p>
        </div>

        <Link
          href={`/specialist-dashboard/profile/edit?profileId=${profile.id}&storeId=${profile.store.id}&serviceTypeId=${profile.serviceType.id}`}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 flex gap-2 items-center"
        >
          <FaRegEdit size={20} /> Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] items-start gap-6">
        <ProfileHeader profile={profile} />
        <div className="space-y-6">
          <BasicInfo profile={profile} />
          <Certifications profile={profile} />
        </div>
      </div>

      <WeeklyAvailability />
      {/* <MyServices /> */}
    </div>
  );
};

export default ProfilePage;