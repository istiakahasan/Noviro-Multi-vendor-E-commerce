import { Skeleton } from "antd";

const WishlistSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="h-56 bg-gray-200">
            <Skeleton.Image active className="!h-full !w-full" />
          </div>

          {/* Content Skeleton */}
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton.Input active style={{ width: 180, height: 20 }} />
              <Skeleton.Input active style={{ width: 80, height: 20 }} />
            </div>

            <Skeleton.Input active style={{ width: 120, height: 16 }} />

            <Skeleton paragraph={{ rows: 2 }} active title={false} />

            <div className="flex items-center gap-3">
              <Skeleton.Button active style={{ width: 90, height: 32 }} />
              <Skeleton.Button active style={{ width: 70, height: 24 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistSkeleton;