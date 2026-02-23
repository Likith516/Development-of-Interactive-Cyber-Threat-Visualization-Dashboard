import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const MetricCard = ({ title, value, icon: Icon, trend, className, color = "primary" }) => {
    const colorClasses = {
        primary: "text-primary border-primary/20 bg-primary/5",
        secondary: "text-secondary border-secondary/20 bg-secondary/5",
        accent: "text-accent border-accent/20 bg-accent/5",
        white: "text-white border-white/20 bg-white/5",
    };

    return (
        <div className={cn("glass-panel rounded-xl p-6 border transition-all duration-300 hover:border-opacity-50", colorClasses[color] || colorClasses.primary, className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
                </div>
                {Icon && <div className={cn("p-2 rounded-lg bg-black/20", `text-${color}`)}>
                    <Icon size={24} />
                </div>}
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-xs">
                    <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                    <span className="ml-2 text-gray-500">vs last hour</span>
                </div>
            )}
        </div>
    );
};

export default MetricCard;
