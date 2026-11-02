"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoArrowBack, IoPerson, IoBusiness, IoMail, IoCall, IoTime } from "react-icons/io5";
import Link from "next/link";
import { useGetSingleSpecialistByIdQuery } from "@/redux/api/specialistApi/specialistApi";

interface SpecialistDetailsPageProps {
  specialistViewId: string | null;
}

interface Specialist {
  id: string;
  storeId: string;
  userId: string;
  serviceTypeId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  gender: string;
  bio: string;
  phoneNum: string;
  available: boolean;
  rating: string;
  experience: string;
  status: string;
  specialistTime: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalReviews: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  serviceType: {
    id: string;
    name: string;
  };
}

export default function SpecialistDetailsPage({ specialistViewId }: SpecialistDetailsPageProps) {
  const router = useRouter();

  const { 
    data: specialistResponse, 
    isLoading, 
    error 
  } = useGetSingleSpecialistByIdQuery(specialistViewId!, {
    skip: !specialistViewId,
  });

  const specialist: Specialist | undefined = specialistResponse?.data;

  const getAvailabilityBadge = (available: boolean) => {
    if (available) {
      return { 
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Available"
      };
    } else {
      return { 
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Not Available"
      };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { color: "bg-green-100 text-green-800 border-green-200", text: "Active" };
      case 'inactive':
        return { color: "bg-gray-100 text-gray-800 border-gray-200", text: "Inactive" };
      case 'pending':
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Pending" };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", text: status || "Unknown" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading specialist details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !specialist) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">
                {error ? "Error loading specialist details" : "Specialist not found"}
              </p>
              <Button onClick={() => router.push('/seller-dashboard/specialist')} className="mt-4">
                Back to Specialists
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availabilityBadge = getAvailabilityBadge(specialist.available);
  const statusBadge = getStatusBadge(specialist.status);
  const fullName = `${specialist.firstName} ${specialist.lastName}`;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/seller-dashboard/specialist')}
              className="h-9 w-9"
            >
              <IoArrowBack className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Specialist Details</h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Link href="/seller-dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/seller-dashboard/specialist" className="hover:text-gray-700">
                  Specialists
                </Link>
                <span>/</span>
                <span className="text-gray-900">Details</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IoPerson className="h-5 w-5" />
                  Specialist Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={specialist.user.profilePic || "/placeholder-avatar.jpg"}
                    alt={fullName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{fullName}</h3>
                  <p className="text-gray-600 text-sm">{specialist.title}</p>
                  <div className="flex gap-2 justify-center mt-2">
                    <Badge className={`${availabilityBadge.color}`}>
                      {availabilityBadge.text}
                    </Badge>
                    <Badge className={`${statusBadge.color}`}>
                      {statusBadge.text}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <IoMail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{specialist.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IoCall className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{specialist.phoneNum}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IoBusiness className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="text-sm font-medium capitalize">{specialist.serviceType.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating & Reviews */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <p className="text-blue-600 text-sm mb-1">Rating</p>
                <p className="text-3xl font-bold text-blue-900">{specialist.rating}/5</p>
                <div className="mt-4">
                  <p className="text-blue-700 text-sm">Reviews Summary</p>
                  <p className="text-2xl font-bold text-blue-900">{specialist.averageRating}/5</p>
                  <p className="text-blue-600 text-xs mt-1">({specialist.totalReviews} reviews)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{fullName}</h2>
                  <p className="text-gray-600 leading-relaxed">{specialist.bio}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{specialist.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <IoTime className="h-4 w-4" />
                      Availability Time
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{specialist.specialistTime}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{specialist.gender.toLowerCase()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Type</label>
                    <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{specialist.serviceType.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IDs & User Info */}
            <Card>
              <CardHeader>
                <CardTitle>IDs & Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Specialist ID</label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{specialist.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{specialist.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Store ID</label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{specialist.storeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Type ID</label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{specialist.serviceTypeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Role</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{specialist.user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Status</label>
                    <Badge className={`mt-1 ${getStatusBadge(specialist.user.status).color}`}>
                      {getStatusBadge(specialist.user.status).text}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Specialist Created</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(specialist.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Specialist Updated</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(specialist.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Account Created</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(specialist.user.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Account Updated</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(specialist.user.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}