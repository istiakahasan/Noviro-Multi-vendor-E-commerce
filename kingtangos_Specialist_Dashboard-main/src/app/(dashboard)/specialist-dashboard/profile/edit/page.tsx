



// 'use client';

// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';
// import {
//   useGetMyProfileQuery,
//   useUpdateProfileByIdMutation,
// } from '@/lib/api/myProfile/settingsApi';
// import PageLoading from '@/components/ui/Loading';

// // Zod Schema — updated to match backend fields
// const profileSchema = z.object({
//   storeId: z.string().min(1, 'Store is required'),
//   serviceTypeId: z.string().min(1, 'Service Type is required'),
//   firstName: z.string().min(2, 'First name is required'),
//   lastName: z.string().min(2, 'Last name is required'),
//   title: z.string().min(3, 'Title is required'),
//   email: z.string().email('Invalid email'),
//   phoneNum: z.string().min(10, 'Valid phone number required'),
//   bio: z.string().min(20, 'Bio must be at least 20 characters'),
//   experience: z.string().min(1, 'Experience is required'),
//   specialistTime: z.string().min(1, 'Working hours required'),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
//   available: z.boolean(),
//   status: z.string().min(1, 'Status is required'),
//   rating: z.string().min(1, 'Rating is required'),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;
// interface Something {
//   data?: {
//     message?: string;
//   };
// }

// const EditProfilePage = () => {
//   const { data, isLoading: loadingProfile } = useGetMyProfileQuery();
//   const [updateProfile, { isLoading: isUpdating }] =
//     useUpdateProfileByIdMutation();

//   const profile = data?.data;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       storeId: '',
//       serviceTypeId: '',
//       firstName: '',
//       lastName: '',
//       title: '',
//       email: '',
//       phoneNum: '',
//       bio: '',
//       experience: '',
//       specialistTime: '',
//       gender: 'MALE',
//       available: true,
//       status: '',
//       rating: '',
//     },
//   });

//   // Load data into form
//   React.useEffect(() => {
//     if (profile) {
//       reset({
//         storeId: profile.storeId,
//         serviceTypeId: profile.serviceTypeId,
//         firstName: profile.firstName,
//         lastName: profile.lastName,
//         title: profile.title,
//         email: profile.email,
//         phoneNum: profile.phoneNum,
//         bio: profile.bio,
//         experience: profile.experience,
//         specialistTime: profile.specialistTime,
//         gender: profile.gender as 'MALE' | 'FEMALE' | 'OTHER',
//         available: profile.available,
//         status: profile.status,
//         rating: profile.rating,
//       });
//     }
//   }, [profile, reset]);

//   const onSubmit = async (formData: ProfileFormData) => {
//     if (!profile?.id) {
//       toast.error('Profile ID missing');
//       return;
//     }

//     try {
//       await updateProfile({
//         id: profile.id,
//         body: {
//           storeId: formData.storeId,
//           serviceTypeId: formData.serviceTypeId,
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           title: formData.title,
//           email: formData.email,
//           gender: formData.gender,
//           bio: formData.bio,
//           available: formData.available,
//           rating: formData.rating,
//           experience: formData.experience,
//           status: formData.status,
//           specialistTime: formData.specialistTime,
//         },
//       }).unwrap();

//       toast.success('Profile updated successfully!');
//     } catch (error: unknown) {
//       const errorMessage = (error as Something)?.data?.message || 'Failed to update profile';
//       toast.error(errorMessage);
//     }
//   };

//   if (loadingProfile) {
//     return (
//       <PageLoading/>
//     );
//   }

//   return (
//     <div className="max-w-6xl min-h-[calc(100vh-150px)] mx-auto p-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
//         <p className="text-gray-500 text-sm mt-1">
//           Update your professional information
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
//         {/* Basic Info */}
//         <section>
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">
//             Basic Information
//           </h2>

         

//           {/* Firstname, lastname, title */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 First Name
//               </label>
//               <input
//                 {...register('firstName')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.firstName && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.firstName.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Last Name
//               </label>
//               <input
//                 {...register('lastName')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.lastName && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.lastName.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Title
//               </label>
//               <input
//                 {...register('title')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.title && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.title.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Email + Phone */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 {...register('email')}
//                 type="email"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Phone Number
//               </label>
//               <input
//                 {...register('phoneNum')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.phoneNum && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.phoneNum.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Bio */}
//           <div className="mt-6">
//             <label className="text-sm font-medium text-gray-700">Bio</label>
//             <textarea
//               {...register('bio')}
//               rows={5}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
//             />
//             {errors.bio && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.bio.message}
//               </p>
//             )}
//           </div>
//         </section>

//         {/* Professional Details */}
//         <section>
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">
//             Professional Details
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Experience
//               </label>
//               <input
//                 {...register('experience')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.experience && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.experience.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Working Hours
//               </label>
//               <input
//                 {...register('specialistTime')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.specialistTime && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.specialistTime.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Gender
//               </label>
//               <select
//                 {...register('gender')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               >
//                 <option value="MALE">MALE</option>
//                 <option value="FEMALE">FEMALE</option>
//                 <option value="OTHER">OTHER</option>
//               </select>
//             </div>
//           </div>

//           {/* Status + Rating */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Status
//               </label>
//               <input
//                 {...register('status')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//               />
//               {errors.status && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.status.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Rating
//               </label>
//               <input
//                 {...register('rating')}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 placeholder="e.g. 4.7"
//               />
//               {errors.rating && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.rating.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="mt-6 flex items-center">
//             <input type="checkbox" {...register('available')} className="w-5 h-5" />
//             <label className="ml-3 text-sm font-medium text-gray-700">
//               Available for bookings
//             </label>
//           </div>
//         </section>

//         {/* Submit buttons */}
//         <div className="flex gap-4 pt-6 border-t">
//           <button
//             type="submit"
//             disabled={isUpdating}
//             className="bg-gray-800 text-white rounded-md px-8 py-3 flex items-center gap-2"
//           >
//             {isUpdating ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" /> Saving...
//               </>
//             ) : (
//               'Save Changes'
//             )}
//           </button>

//           <button
//             type="button"
//             onClick={() => reset()}
//             className="border border-gray-300 text-gray-700 rounded-md px-8 py-3"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditProfilePage;






'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Upload, User } from 'lucide-react';
import PageLoading from '@/components/ui/Loading';
import { useGetMyProfileQuery, useUpdateProfileMutation } from '@/lib/api/myProfile/settingsApi';

// Zod Schema
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  title: z.string().min(3, 'Title is required'),
  email: z.string().email('Invalid email'),
  phoneNum: z.string().min(10, 'Valid phone number required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  experience: z.string().min(1, 'Experience is required'),
  specialistTime: z.string().min(1, 'Working hours required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  available: z.boolean(),
  status: z.string().min(1, 'Status is required'),
  rating: z.string().min(1, 'Rating is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const EditProfilePage = () => {
  const { data, isLoading: loadingProfile } = useGetMyProfileQuery();
  const profile = data?.data;

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phoneNum: '',
      bio: '',
      experience: '',
      specialistTime: '',
      gender: 'MALE',
      available: true,
      status: '',
      rating: '',
    },
  });

  // Load existing profile data
  React.useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        title: profile.title || '',
        email: profile.email || '',
        phoneNum: profile.phoneNum || '',
        bio: profile.bio || '',
        experience: profile.experience || '',
        specialistTime: profile.specialistTime || '',
        gender: profile.gender as 'MALE' | 'FEMALE' | 'OTHER',
        available: profile.available ?? true,
        status: profile.status || '',
        rating: profile.rating || '',
      });

      if (profile?.user?.profilePic) {
        setPreview(profile.user.profilePic);
      }
    }
  }, [profile, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const formPayload = new FormData();

      // Build the object that will become the JSON string
      const updateObject = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: formData.title,
        email: formData.email,
        phoneNum: formData.phoneNum,
        gender: formData.gender,
        bio: formData.bio,
        available: formData.available,
        rating: formData.rating,
        experience: formData.experience,
        status: formData.status,
        specialistTime: formData.specialistTime,
      };

      // Convert to JSON string and append as 'data'
      formPayload.append('data', JSON.stringify(updateObject));

      // Add image if selected
      if (selectedFile) {
        formPayload.append('file', selectedFile);
      }

      // Debug: log what is actually being sent
      console.log('Sending FormData:');
      console.log('data:', JSON.stringify(updateObject, null, 2));
      if (selectedFile) {
        console.log('file:', selectedFile.name, `(${selectedFile.size} bytes)`);
      }

      await updateProfile(formPayload).unwrap();

      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  });

  if (loadingProfile) {
    return <PageLoading />;
  }

  return (
    <div className="max-w-6xl min-h-[calc(100vh-150px)] mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          Update your professional information
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-10">
        {/* Profile Photo */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Photo</h2>

          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <div>
              <label
                htmlFor="profile-image"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors"
              >
                <Upload size={16} />
                Upload new photo
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG • Max 5MB
              </p>
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                {...register('firstName')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                {...register('lastName')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                {...register('title')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                {...register('phoneNum')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.phoneNum && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNum.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              rows={5}
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>
        </section>

        {/* Professional Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Professional Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Experience</label>
              <input
                {...register('experience')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Working Hours</label>
              <input
                {...register('specialistTime')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.specialistTime && (
                <p className="text-red-500 text-sm mt-1">{errors.specialistTime.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select
                {...register('gender')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <input
                {...register('status')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Rating</label>
              <input
                {...register('rating')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g. 4.7"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <input type="checkbox" {...register('available')} className="w-5 h-5" />
            <label className="ml-3 text-sm font-medium text-gray-700">
              Available for bookings
            </label>
          </div>
        </section>

        {/* Submit buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting || isUpdating}
            className="bg-gray-800 text-white rounded-md px-8 py-3 flex items-center gap-2"
          >
            {isSubmitting || isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setPreview(null);
              setSelectedFile(null);
            }}
            className="border border-gray-300 text-gray-700 rounded-md px-8 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;