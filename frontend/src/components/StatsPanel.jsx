import React from 'react';
import { Activity, ShieldAlert, Zap, Globe, MapPin } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card" style={{ padding: '1.5rem', alignItems: 'center', textAlign: 'center', minWidth: '150px' }}>
        <div style={{
            background: `rgba(${color}, 0.1)`,
            padding: '12px',
            borderRadius: '50%',
            marginBottom: '1rem',
            color: `rgb(${color})`
        }}>
            <Icon size={24} />
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}>{value}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{title}</div>
    </div>
);

const StatsPanel = ({ stats, indicators }) => {
    // Calculate top country
    const countries = {};
    indicators.forEach(i => {
        if (i.country) countries[i.country] = (countries[i.country] || 0) + 1;
    });
    const topCountry = Object.entries(countries).sort((a, b) => b[1] - a[1])[0];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <StatCard
                title="Active Threats"
                value={stats.threats}
                icon={ShieldAlert}
                color="239, 68, 68" // red
            />
            <StatCard
                title="Malicious Indicators"
                value={stats.indicators || 0}
                icon={Zap}
                color="249, 115, 22" // orange
            />
            <StatCard
                title="Top Source"
                value={topCountry ? topCountry[0] : 'N/A'}
                icon={Globe}
                color="56, 189, 248" // blue
            />
            <StatCard
                title="Monitored Devices"
                value={stats.devices}
                icon={Activity}
                color="34, 197, 94" // green
            />
        </div>
    );
};

export default StatsPanel;
