"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoArrowBack, IoPencil, IoPerson, IoVideocam, IoCall } from "react-icons/io5";
import Link from "next/link";
import { useGetSingleConsultationByIdQuery } from "@/redux/api/consultationApi/consultationApi";

interface ConsultationDetailsPageProps {
  consultationViewId: string | null;
}

// Add proper TypeScript interface for consultation data
interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  experiences: number;
  consultationTime: string;
  title: string;
  type: "VIDEO" | "VOICE" | "IN_PERSON";
  createdAt: string;
  updatedAt: string;
}

export default function ConsultationDetailsPage({ consultationViewId }: ConsultationDetailsPageProps) {
  const router = useRouter();

  // Proper hook usage with TypeScript
  const { 
    data: consultationResponse, 
    isLoading, 
    error 
  } = useGetSingleConsultationByIdQuery(consultationViewId!, {
    skip: !consultationViewId,
  });

  const consultation: Consultation | undefined = consultationResponse?.data;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "VIDEO":
        return { 
          variant: "default" as const, 
          icon: IoVideocam,
          color: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Video Call"
        };
      case "VOICE":
        return { 
          variant: "secondary" as const, 
          icon: IoCall,
          color: "bg-green-100 text-green-800 border-green-200",
          text: "Voice Call"
        };
      default:
        return { 
          variant: "outline" as const, 
          icon: IoPerson,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: type
        };
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading consultation details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !consultation) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">
                {error ? "Error loading consultation details" : "Consultation not found"}
              </p>
              <Button onClick={() => router.push('/seller-dashboard/consultation')} className="mt-4">
                Back to Consultations
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const typeBadge = getTypeBadge(consultation.type);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/seller-dashboard/consultation')}
              className="h-9 w-9"
            >
              <IoArrowBack className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Consultation Details</h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Link href="/seller-dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/seller-dashboard/consultation" className="hover:text-gray-700">
                  Consultations
                </Link>
                <span>/</span>
                <span className="text-gray-900">Details</span>
              </nav>
            </div>
          </div>
          
          <Link href={`/seller-dashboard/consultation/edit-consultation/${consultation.id}`}>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <IoPencil className="h-4 w-4" />
              Edit Consultation
            </Button>
          </Link>
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
                  Consultant Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={consultation.profilePic}
                    alt={consultation.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{consultation.name}</h3>
                  <p className="text-gray-600 text-sm">{consultation.title}</p>
                </div>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle>Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <Badge variant={typeBadge.variant} className={typeBadge.color}>
                    <typeBadge.icon className="h-3 w-3 mr-1" />
                    {typeBadge.text}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{consultation.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{consultation.experiences} years</span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <p className="text-blue-600 text-sm mb-1">Session Price</p>
                <p className="text-3xl font-bold text-blue-900">€{consultation.price}</p>
                <p className="text-blue-700 text-sm mt-1">per session</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Consultation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{consultation.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{consultation.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Consultation ID</label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{consultation.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Available Time</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{consultation.consultationTime}</p>
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
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(consultation.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(consultation.updatedAt)}
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