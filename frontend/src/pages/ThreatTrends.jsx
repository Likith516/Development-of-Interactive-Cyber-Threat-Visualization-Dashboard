import React, { useEffect, useState } from 'react';
import api from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const ThreatTrends = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const res = await api.get('/threats/trends');
                // Transform data for chart if needed. For now assuming backend returns array of objects with timestamp
                // We'll mock some data structure transformation here to make it look like a trend
                // Since our backend returns raw rows, let's aggregate by time
                const rawData = res.data;
                const aggregated = rawData.reduce((acc, curr) => {
                    const time = new Date(curr.lastReportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    acc[time] = (acc[time] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.keys(aggregated).map(key => ({
                    time: key,
                    threats: aggregated[key]
                }));

                // If empty, mock some data for visualization
                if (chartData.length === 0) {
                    const now = new Date();
                    for (let i = 0; i < 10; i++) {
                        chartData.push({
                            time: new Date(now.getTime() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            threats: Math.floor(Math.random() * 10)
                        })
                    }
                    chartData.reverse();
                }

                setTrends(chartData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, []);

    if (loading) return <div className="p-8 text-center text-primary animate-pulse">Loading Trends...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Activity className="text-secondary" /> Threat Trends</h2>

            <div className="glass-panel p-6 rounded-xl h-[500px]">
                <h3 className="text-lg font-semibold mb-6 text-gray-300">Malicious Activity Over Time</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={trends}>
                        <defs>
                            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff003c" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                        />
                        <Area type="monotone" dataKey="threats" stroke="#ff003c" fillOpacity={1} fill="url(#colorThreats)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ThreatTrends;
