import React from 'react';
import { AlertTriangle, Globe, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ThreatList = ({ indicators }) => {
    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">
                    <AlertTriangle size={20} className="text-red-400" />
                    <span>Detected Malicious IPs</span>
                </div>
            </div>
            <div className="threat-list">
                {indicators.map((item) => (
                    <div key={item.id} className="threat-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className={`status-dot ${item.severity === 'critical' || item.severity === 'high' ? 'status-offline' : 'status-online'}`}
                                    style={{ background: item.severity === 'critical' ? 'red' : item.severity === 'high' ? 'orange' : 'yellow' }}
                                ></span>
                                {item.indicator}
                            </h4>
                            <span className="device-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} /> {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : 'Just now'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--accent-blue)', marginBottom: '0.2rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Globe size={12} /> {item.country || 'Unknown'}
                            </span>
                            <span>ISP: {item.isp || 'N/A'}</span>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Type: {item.type} | Severity: {item.severity?.toUpperCase()}
                        </div>
                    </div>
                ))}
                {indicators.length === 0 && <div className="text-secondary" style={{ padding: '1rem', textAlign: 'center' }}>No threats detected yet.</div>}
            </div>
        </div>
    );
};

export default ThreatList;
