import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, RefreshCw, Download } from 'lucide-react';
import DeviceList from './components/DeviceList';
import ThreatList from './components/ThreatList';
import CyberMap from './components/CyberMap';
import StatsPanel from './components/StatsPanel';

const API_Base = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001';

function App() {
  const [devices, setDevices] = useState([]);
  const [threats, setThreats] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [stats, setStats] = useState({ threats: 0, devices: 0, indicators: 0 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // Don't set loading true here to avoid flickering on auto-refresh
    try {
      const [devRes, threatRes, indRes, statRes] = await Promise.all([
        axios.get(`${API_Base}/devices`),
        axios.get(`${API_Base}/threats`),
        axios.get(`${API_Base}/indicators`),
        axios.get(`${API_Base}/stats`)
      ]);
      setDevices(devRes.data);
      setThreats(threatRes.data);
      setIndicators(indRes.data);
      setStats(statRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handeRefresh = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_Base}/refresh`);
      // Wait bigger delay for IPinfo enrichment to happen in background
      setTimeout(fetchData, 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Merge indicators into threats structure for map if needed, 
  // or pass full list of threats (which contain indicators) to map.
  // The backend '/threats' endpoint might not return full nested indicators if pydantic config is strict,
  // but let's check. 
  // Actually, we fetched /indicators separately for the map which is better.
  // We will construct a 'map friendly' object or just pass threats + independent indicators.
  // For the CyberMap, let's pass threats which have nesting, OR indicators list.
  // Let's pass 'threats' but ensure we populate it properly. 
  // Wait, the API /threats returns ThreatPulseSchema which has `indicators: List[IndicatorSchema]`.
  // So 'threats' state should have everything if the backend query does a join.
  // Note: SQLAlchemy default relationship loading might be lazy. 
  // I will check backend query in main.py. It does `db.query(models.ThreatPulse)...` 
  // The relationship is default lazy. Pydantic will try to access it. 
  // It should work if session is open, but FastAPI response model handles it.

  // For safety, let's pass a combined list to map if needed.
  // But actually CyberMap logic iterates `threats.forEach(t => t.indicators...)`.
  // So we need to be sure `threats` has indicators.

  return (
    <div>
      <header className="header">
        <h1>Threat Monitor <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', border: '1px solid', padding: '2px 6px', borderRadius: '4px', marginLeft: '10px' }}>PRO</span></h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="refresh-btn" onClick={handeRefresh} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Feed'}
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div style={{ gridColumn: '1 / -1' }}>
          <StatsPanel stats={stats} indicators={indicators} />
        </div>

        <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
          <CyberMap threats={threats} />
        </div>

        <aside>
          <DeviceList devices={devices} />
        </aside>

        <main>
          <ThreatList indicators={indicators} />
        </main>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
