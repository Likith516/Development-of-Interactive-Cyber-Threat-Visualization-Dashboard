import React, { useEffect, useState } from 'react';
import api from '../api';
import { List, Search, Filter } from 'lucide-react';
import clsx from 'clsx';

const IOCs = () => {
    const [iocs, setIocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchIOCs = async () => {
            try {
                const res = await api.get('/iocs');
                setIocs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIOCs();
    }, []);

    const filteredIocs = iocs.filter(ioc =>
        ioc.indicator.toLowerCase().includes(filter.toLowerCase()) ||
        ioc.type.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2"><List className="text-accent" /> Indicators of Compromise</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search IOCs..."
                        className="pl-10 pr-4 py-2 bg-surfaceHighlight border border-white/10 rounded-lg focus:outline-none focus:border-primary text-sm w-full md:w-64 transition-colors"
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Indicator</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Confidence</th>
                                <th className="px-6 py-4">Last Seen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading IOCs...</td></tr>
                            ) : filteredIocs.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No IOCs found</td></tr>
                            ) : (
                                filteredIocs.map((ioc) => (
                                    <tr key={ioc.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-primary truncate max-w-xs">{ioc.indicator}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-white/10 rounded text-xs">{ioc.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{ioc.source}</td>
                                        <td className="px-6 py-4 text-gray-300">{ioc.threatCategory || 'General'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx("h-full", ioc.confidence > 50 ? "bg-red-500" : "bg-yellow-500")}
                                                        style={{ width: `${ioc.confidence}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(ioc.lastSeen).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IOCs;
