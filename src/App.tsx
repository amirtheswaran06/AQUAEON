import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { DataCenters } from './pages/DataCenters';
import { WorkloadScheduler } from './pages/WorkloadScheduler';
import { EnergyAnalytics } from './pages/EnergyAnalytics';
import { WaterSustainability } from './pages/WaterSustainability';
import { AIInsights } from './pages/AIInsights';
import { Alerts } from './pages/Alerts';
import { Architecture } from './pages/Architecture';
import { Settings } from './pages/Settings';

const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { alerts } = useSimulation();

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={(page) => setCurrentPage(page)} />;
      case 'datacenters':
        return <DataCenters />;
      case 'scheduler':
        return <WorkloadScheduler />;
      case 'energy':
        return <EnergyAnalytics />;
      case 'water':
        return <WaterSustainability />;
      case 'ai-insights':
        return <AIInsights />;
      case 'alerts':
        return <Alerts />;
      case 'architecture':
        return <Architecture />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={(page) => setCurrentPage(page)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#071827] text-slate-100 flex">
      {/* Persistent Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeAlertCount={activeAlertCount}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Header */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateAlerts={() => setCurrentPage('alerts')}
          activeAlertCount={activeAlertCount}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <MainLayout />
    </SimulationProvider>
  );
}
