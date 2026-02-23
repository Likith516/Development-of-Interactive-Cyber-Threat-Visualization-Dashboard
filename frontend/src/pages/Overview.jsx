import React, { useEffect, useState } from 'react';
import api from '../api';
import MetricCard from '../components/MetricCard';
import { Shield, AlertTriangle, CheckCircle, Globe, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import clsx from 'clsx';

const Overview = () => {
    const [stats, setStats] = useState(null);
    const [recentThreats, setRecentThreats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, threatsRes] = await Promise.all([
                api.get('/threats/statistics'),
                api.get('/threats?limit=5')
            ]);
            setStats(statsRes.data);
            setRecentThreats(threatsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s refresh for "live" feel
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full text-primary animate-pulse">Initializing Dashboard...</div>;

    const data = [
        { name: 'Safe', value: stats?.safeIPs || 0, color: '#39ff14' },
        { name: 'Suspicious', value: stats?.suspiciousIPs || 0, color: '#fbbf24' },
        { name: 'Malicious', value: stats?.maliciousIPs || 0, color: '#ff003c' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Activity className="text-primary" /> System Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Monitored IPs" value={stats?.totalIPs || 0} icon={Globe} color="white" />
                <MetricCard title="Malicious Detected" value={stats?.maliciousIPs || 0} icon={Shield} color="secondary" />
                <MetricCard title="Suspicious Activity" value={stats?.suspiciousIPs || 0} icon={AlertTriangle} color="accent" /> {/* Using accent for suspicious (yellow/gold usually but mapped to green/accent here, maybe change prop) */}
                <MetricCard title="Safe Entities" value={stats?.safeIPs || 0} icon={CheckCircle} color="primary" /> {/* Primary is cyan */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 text-white">Threat Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121212', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 text-white">Top Targets</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-gray-400">Most Targeted Country</span>
                            <span className="font-bold text-primary">{stats?.topCountry || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-gray-400">System Status</span>
                            <span className="font-bold text-green-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-white">Recent Detections</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="pb-3 pl-2">IP Address</th>
                                <th className="pb-3">Country</th>
                                <th className="pb-3">Risk Level</th>
                                <th className="pb-3">Abuse Score</th>
                                <th className="pb-3">Last Seen</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {(recentThreats || []).map((threat) => (
                                <tr key={threat.ip} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 pl-2 font-mono text-primary">{threat.ip}</td>
                                    <td className="py-3">{threat.countryCode || 'N/A'}</td>
                                    <td className="py-3">
                                        <span className={clsx(
                                            "px-2 py-1 rounded text-xs font-bold",
                                            threat.riskLevel === 'Malicious' ? "bg-red-500/20 text-red-500" :
                                                threat.riskLevel === 'Suspicious' ? "bg-yellow-500/20 text-yellow-500" :
                                                    "bg-green-500/20 text-green-500"
                                        )}>
                                            {threat.riskLevel}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={clsx("h-full", threat.abuseScore > 50 ? "bg-red-500" : "bg-green-500")}
                                                    style={{ width: `${threat.abuseScore}%` }}
                                                />
                                            </div>
                                            <span className="text-xs">{threat.abuseScore}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-gray-500">{new Date(threat.lastReportedAt).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
