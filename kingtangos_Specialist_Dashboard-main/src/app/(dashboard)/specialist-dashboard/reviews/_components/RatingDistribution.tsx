import { Star } from "lucide-react";
import React from "react";

interface Props {
  distribution: Record<number, number>;
}

export default function RatingDistribution({ distribution }: Props) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 lg:w-2/3">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Rating Distribution
      </h3>
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={star} className="flex items-center gap-2">
              <div className="w-6 text-xs flex items-center gap-2">
                {star}
               <Star size={10} fill="currentColor" stroke="currentColor" className="text-yellow-400" strokeWidth={1.2} />

              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-yellow-400 rounded-full"
                />
              </div>
              <div className="w-6 text-xs text-gray-500 text-right">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
