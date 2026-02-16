import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Globe } from 'lucide-react';

const HeatmapLayer = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (!points || points.length === 0) return;

        const heat = L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            max: 1.0,
            gradient: {
                0.4: 'blue',
                0.6: 'cyan',
                0.7: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        }).addTo(map);

        return () => {
            map.removeLayer(heat);
        };
    }, [points, map]);

    return null;
};

const ThreatMap = ({ threats }) => {
    // Filter valid coordinates and format for heatlayer: [lat, lon, intensity]
    // Using a default intensity of 0.8 for visibility
    const heatPoints = threats
        .filter(t => t.lat !== undefined && t.lon !== undefined && t.lat !== null && t.lon !== null)
        .map(t => [t.lat, t.lon, 0.8]);

    return (
        <div className="card" style={{ height: '400px', padding: '0', position: 'relative', overflow: 'hidden' }}>
            <div className="card-header" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 999, pointerEvents: 'none' }}>
                <div className="card-title" style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '0.5rem 1rem', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid var(--border-color)', pointerEvents: 'auto' }}>
                    <Globe size={20} className="text-blue-400" />
                    <span>Global Threat Intensity</span>
                </div>
            </div>

            <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                />
                <HeatmapLayer points={heatPoints} />
            </MapContainer>

            <style>{`
        .leaflet-container {
            font-family: 'Inter', sans-serif;
            background: #0f172a;
        }
        .map-tiles {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
        </div>
    );
};

export default ThreatMap;
