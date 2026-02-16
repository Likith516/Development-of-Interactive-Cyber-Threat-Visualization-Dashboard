import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Globe, AlertTriangle } from 'lucide-react';

// Custom Pulsing Icon
const createPulsingIcon = (severity) => {
    const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f97316' : '#22c55e';
    return L.divIcon({
        className: 'custom-pin',
        html: `<div class="pin" style="background:${color}"></div><div class="pulse" style="border-color:${color}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const CyberMap = ({ threats }) => {
    // Extract indicators with valid location
    const indicators = [];
    threats.forEach(t => {
        t.indicators.forEach(ind => {
            if (ind.lat != null && ind.lon != null) {
                indicators.push({ ...ind, pulseName: t.name });
            }
        });
        // Also add pulse center if no indicators but has loc
        if (t.lat != null && t.lon != null && t.indicators.length === 0) {
            indicators.push({
                id: t.id,
                lat: t.lat,
                lon: t.lon,
                severity: 'medium',
                type: 'Pulse Origin',
                pulseName: t.name,
                country: 'Unknown',
                city: 'Unknown'
            });
        }
    });

    return (
        <div className="card" style={{ height: '500px', padding: '0', position: 'relative', overflow: 'hidden' }}>
            <div className="card-header" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 999, pointerEvents: 'none' }}>
                <div className="card-title" style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '0.5rem 1rem', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid var(--border-color)', pointerEvents: 'auto' }}>
                    <Globe size={20} className="text-blue-400" />
                    <span>Live Cyber Attack Map</span>
                </div>
            </div>

            <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MarkerClusterGroup chunkedLoading>
                    {indicators.map((ind, idx) => (
                        <Marker key={`${ind.id}-${idx}`} position={[ind.lat, ind.lon]} icon={createPulsingIcon(ind.severity)}>
                            <Popup className="cyber-popup">
                                <div style={{ minWidth: '200px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <AlertTriangle size={14} color={ind.severity === 'high' ? 'red' : 'orange'} />
                                        {ind.type}
                                    </h4>
                                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                                        <div><strong>IP/Domain:</strong> {ind.indicator || ind.type}</div>
                                        <div><strong>Threat:</strong> {ind.pulseName}</div>
                                        <div><strong>Location:</strong> {ind.city && ind.city !== 'Unknown' ? `${ind.city}, ` : ''}{ind.country || 'Unknown'}</div>
                                        <div><strong>ISP:</strong> {ind.isp || 'N/A'}</div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            <style>{`
        .leaflet-container {
            font-family: 'Inter', sans-serif;
            background: #0f172a;
        }
        
        /* Pin & Pulse Animation */
        .custom-pin {
            position: relative;
        }
        .pin {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .pulse {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-animation 2s infinite;
            opacity: 0;
        }
        
        @keyframes pulse-animation {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }

        .leaflet-popup-content-wrapper {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(4px);
            border-radius: 8px;
        }
      `}</style>
        </div>
    );
};

export default CyberMap;
