import React from 'react';
import { Shield, Smartphone, Server, Loader } from 'lucide-react';

const DeviceList = ({ devices }) => {
    const getIcon = (name) => {
        if (name.includes('Router')) return <Server size={18} />;
        if (name.includes('Phone')) return <Smartphone size={18} />;
        return <Shield size={18} />;
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'safe': return 'status-safe';
            case 'compromised': return 'status-compromised';
            default: return 'status-unknown';
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">
                    <Server size={20} className="text-blue-400" />
                    <span>Monitored Devices</span>
                </div>
            </div>
            <div className="device-list">
                {devices.map((device) => (
                    <div key={device.id} className="device-item">
                        <div className="device-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {getIcon(device.name)}
                                <h4>{device.name}</h4>
                            </div>
                            <div className="device-meta">{device.ip_address}</div>
                        </div>
                        <span className={`status-badge ${getStatusClass(device.status)}`}>
                            {device.status}
                        </span>
                    </div>
                ))}
                {devices.length === 0 && <div className="text-secondary">No devices found.</div>}
            </div>
        </div>
    );
};

export default DeviceList;
