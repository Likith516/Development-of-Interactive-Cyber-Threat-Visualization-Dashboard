import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Map, Search, List, Menu, X } from 'lucide-react';
import Overview from './pages/Overview';
import ThreatTrends from './pages/ThreatTrends';
import ThreatMapHelper from './pages/ThreatMapHelper'; // Wrapper specifically for Leaflet dynamic import if needed
import IOCs from './pages/IOCs';
import IpChecker from './pages/IpChecker';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function for class merging
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
      isActive ? "bg-primary/20 text-primary border-l-2 border-primary" : "text-gray-400 hover:bg-surfaceHighlight hover:text-white"
    )}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/5 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/5">
          <Shield className="text-primary" size={28} />
          <h1 className="text-xl font-bold tracking-tight">Threat<span className="text-primary">Monitor</span></h1>
        </div>

        <nav className="flex flex-col gap-1 p-4 mt-4">
          <SidebarItem to="/" icon={Activity} label="Overview" />
          <SidebarItem to="/trends" icon={Activity} label="Threat Trends" />
          <SidebarItem to="/map" icon={Map} label="Geographic Map" />
          <SidebarItem to="/iocs" icon={List} label="IOCs Database" />
          <SidebarItem to="/check-ip" icon={Search} label="IP Reputation" />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Active
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header for Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface">
          <div className="flex items-center gap-2">
            <Shield className="text-primary" size={24} />
            <span className="font-bold">ThreatMonitor</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-black/50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/trends" element={<ThreatTrends />} />
          <Route path="/map" element={<ThreatMapHelper />} />
          <Route path="/iocs" element={<IOCs />} />
          <Route path="/check-ip" element={<IpChecker />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
