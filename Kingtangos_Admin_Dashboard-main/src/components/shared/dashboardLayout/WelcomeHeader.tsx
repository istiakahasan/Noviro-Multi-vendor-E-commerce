export function WelcomeHeader({ name}: {name?: string }) {
  return (
    <div className="bg-gradient-to-r from-[#030213] to-[#155DFC] rounded-xl p-8 mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">Welcome {name} !</h1>
      <p className="text-blue-100">Here&apos;s what&apos;s happening with your store today.</p>
    </div>
  )
}
