"use client"

import { useGetMeQuery } from "@/redux/api/authApi"


export function WelcomeHeader() {
  const { data, isLoading } = useGetMeQuery({})
  
  // Extract user data from the response structure
  const user = data?.data
  const firstName = user?.firstName || "User"
  
  // Get current hour to show appropriate greeting
  const currentHour = new Date().getHours()
  let greeting = "Welcome back"
  
  if (currentHour < 12) {
    greeting = "Good morning"
  } else if (currentHour < 18) {
    greeting = "Good afternoon"
  } else {
    greeting = "Good evening"
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-xl p-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Loading...</h1>
        <p className="text-blue-100">Please wait while we load your data.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-xl p-8 mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">
        {greeting}, {firstName}!
      </h1>
      <p className="text-blue-100">Here&apos;s what&apos;s happening with your store today.</p>
    </div>
  )
}