import React, { useState } from 'react';
import api from '../api';
import { Search, Shield, Globe, Server, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import clsx from 'clsx';
import MetricCard from '../components/MetricCard';

const IpChecker = () => {
    const [ip, setIp] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await api.post('/check-ip', { ip });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to check IP');
        } finally {
            setLoading(false);
        }
    };

    const radarData = result ? [
        { subject: 'Abuse Score', A: result.abuseScore, fullMark: 100 },
        { subject: 'Confidence', A: result.abuseScore, fullMark: 100 }, // Mocking confidence as abuse score for now
        { subject: 'Reports', A: Math.min(result.totalReports * 10, 100), fullMark: 100 },
        { subject: 'Rel. Risk', A: result.riskLevel === 'Malicious' ? 100 : result.riskLevel === 'Suspicious' ? 50 : 0, fullMark: 100 },
    ] : [];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Search className="text-primary" /> IP Reputation Checker</h2>

            <div className="glass-panel p-8 rounded-xl max-w-2xl mx-auto">
                <form onSubmit={handleCheck} className="flex gap-4">
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="Enter IP Address (e.g. 1.1.1.1)"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary/20 text-primary border border-primary/50 rounded-lg hover:bg-primary/30 font-bold transition-all disabled:opacity-50"
                    >
                        {loading ? 'Scanning...' : 'Analyze IP'}
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 bg-red-500/10 p-3 rounded">{error}</p>}
            </div>

            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-6">
                            <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{result.ip}</h3>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Globe size={16} /> <span>{result.countryCode || 'Unknown Country'}</span>
                                        <span className="mx-2">•</span>
                                        <Server size={16} /> <span>{result.isp || 'Unknown ISP'}</span>
                                    </div>
                                </div>
                                <div className={clsx("px-4 py-2 rounded-lg border flex items-center gap-2",
                                    result.riskLevel === 'Malicious' ? "bg-red-500/20 border-red-500 text-red-500" :
                                        result.riskLevel === 'Suspicious' ? "bg-yellow-500/20 border-yellow-500 text-yellow-500" :
                                            "bg-green-500/20 border-green-500 text-green-500"
                                )}>
                                    {result.riskLevel === 'Malicious' ? <AlertTriangle /> : result.riskLevel === 'Suspicious' ? <Activity /> : <CheckCircle />}
                                    <span className="font-bold uppercase">{result.riskLevel}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <MetricCard title="Abuse Confidence Score" value={`${result.abuseScore}%`} icon={Shield} color={result.abuseScore > 50 ? "secondary" : "primary"} />
                                <MetricCard title="Total Reports" value={result.totalReports} icon={Activity} color="accent" />
                            </div>

                            <div className="glass-panel p-6 rounded-xl">
                                <h4 className="font-semibold mb-3 text-gray-300">Technical Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-white/5 rounded">
                                        <span className="block text-gray-500 text-xs uppercase">Domain</span>
                                        <span className="font-mono text-primary truncate block">{result.domain || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded">
                                        <span className="block text-gray-500 text-xs uppercase">Usage Type</span>
                                        <span className="text-white">{result.usageType || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded col-span-2">
                                        <span className="block text-gray-500 text-xs uppercase">Hostnames</span>
                                        <span className="font-mono text-xs text-gray-300 break-all">{result.hostnames ? result.hostnames.replace(/[\"\[\]]/g, ' ') : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center">
                            <h4 className="font-semibold mb-4 text-gray-300 w-full text-left">Risk Analysis</h4>
                            <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#333" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0a0a0', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="IP Risk" dataKey="A" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.4} />
                                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IpChecker;
