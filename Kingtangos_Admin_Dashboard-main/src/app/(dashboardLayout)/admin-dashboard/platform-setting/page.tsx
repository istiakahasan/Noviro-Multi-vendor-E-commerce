import ComitionRate from "./components/ComitionRate";

const SettingPage = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="bg-white mb-2">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Platform Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage all product orders, service bookings, and
            subscription activities.
          </p>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {/* <CommissionSettings /> */}
        <ComitionRate />
      </div>
    </div>
  );
};

export default SettingPage;
