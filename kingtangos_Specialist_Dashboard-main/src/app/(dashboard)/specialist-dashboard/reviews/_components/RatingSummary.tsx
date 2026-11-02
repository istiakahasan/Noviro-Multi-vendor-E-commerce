import React from 'react';
import { Star } from 'lucide-react';

interface Props { average: number; totalReviews: number; }

export default function RatingSummary({ average, totalReviews }: Props) {
  return (
    <div className="flex flex-col gap-4 items-center w-full bg-white p-4 rounded-xl border border-gray-100 lg:w-1/3">
      <p className="text-3xl font-semibold mt-3">{average.toFixed(1)}</p>
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} fill={i < Math.round(average) ? 'currentColor' : 'none'} strokeWidth={1.2} />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500">Based on {totalReviews} reviews</p>
    </div>
  );
}
