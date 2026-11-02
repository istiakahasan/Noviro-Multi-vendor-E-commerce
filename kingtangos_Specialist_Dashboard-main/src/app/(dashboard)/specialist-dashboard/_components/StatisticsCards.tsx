import React from 'react';
import { CiCalendar, CiStar } from "react-icons/ci";
import { FaUserCog } from "react-icons/fa";
import { PiHandshakeDuotone } from "react-icons/pi";




interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor: string;
  icon: React.ReactNode;
  bgClass: string;
  textColor: string;
  borderColor?: string;
  iconBgClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor,
  icon,
  bgClass,
//   textColor,
  borderColor,
  iconBgClass,
}) => {
  return (
    <div className={`${bgClass} ${borderColor ? `border border-${borderColor}-200` : ''} p-6 rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className={`${iconBgClass} p-2 rounded-full text-lg bg-white`}>{icon}</div>
      </div>
      <p className='text-3xl font-bold '>{value}</p>
      <p className={`text-sm ${subtitleColor} mt-1`}>{subtitle}</p>
    </div>
  );
};

interface StatData {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor: string;
  icon: React.ReactNode;
  bgClass: string;
  textColor: string;
  borderColor?: string;
  iconBgClass: string;
}

const StatisticsCards = () => {
  const statsData: StatData[] = [
    {
      title: "Today's Bookings",
      value: "10",
      subtitle: "+12% from yesterday",
      subtitleColor: "text-green-600",
      icon: <CiCalendar />,
      bgClass: "bg-gradient-to-br from-[#FFDFD4] to-[#FF9E7D]",
      textColor: "text-orange-600",
      borderColor: undefined,
      iconBgClass: "bg-white- text-orange-500",
    },
    {
      title: "Upcoming Consultations",
      value: "27",
      subtitle: "+15 new this week",
      subtitleColor: "text-green-600",
      icon: <FaUserCog  />,
      bgClass: "bg-gradient-to-br from-[#D0E4FF] to-[#78B3FF]",
      textColor: "text-blue-600",
      borderColor: undefined,
      iconBgClass: "bg-white- text-blue-500",
    },
    {
      title: "Completed Sessions",
      value: "20",
      subtitle: "+8% this month",
      subtitleColor: "text-green-600",
      icon: <PiHandshakeDuotone />,
      bgClass: "bg-gradient-to-br from-[#BCFBC1] to-[#12AA29]",
      textColor: "text-green-600",
      borderColor: undefined,
      iconBgClass: "bg-white- text-green-500",
    },
    {
      title: "Average Rating",
      value: "4.8",
      subtitle: "Based on 45 reviews",
      subtitleColor: "text-gray-600",
      icon: <CiStar />,
      bgClass: "bg-gradient-to-br from-[#FFE3AF] to-[#CE8C13]",
      textColor: "text-yellow-600",
      borderColor: undefined,
      iconBgClass: "bg-white- text-yellow-500",
    },
  ];

  return (
    <div>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            subtitleColor={stat.subtitleColor}
            icon={stat.icon}
            bgClass={stat.bgClass}
            textColor={stat.textColor}
            borderColor={stat.borderColor}
            iconBgClass={stat.iconBgClass}
          />
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;