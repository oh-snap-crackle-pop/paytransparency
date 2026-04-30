import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/hr/DashboardPage';
import { SalaryBandsPage } from '@/pages/hr/SalaryBandsPage';
import { JustificationsPage } from '@/pages/hr/JustificationsPage';
import { ReviewCyclePage } from '@/pages/hr/ReviewCyclePage';
import { ReportsPage } from '@/pages/hr/ReportsPage';
import { AssistantPage } from '@/pages/hr/AssistantPage';
import { MyPayPage } from '@/pages/employee/MyPayPage';
import { CriteriaPage } from '@/pages/employee/CriteriaPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/hr/dashboard" replace />} />
        <Route path="/hr/dashboard" element={<DashboardPage />} />
        <Route path="/hr/bands" element={<SalaryBandsPage />} />
        <Route path="/hr/justifications" element={<JustificationsPage />} />
        <Route path="/hr/review" element={<ReviewCyclePage />} />
        <Route path="/hr/reports" element={<ReportsPage />} />
        <Route path="/hr/assistant" element={<AssistantPage />} />
        <Route path="/me" element={<MyPayPage />} />
        <Route path="/me/criteria" element={<CriteriaPage />} />
        <Route path="*" element={<Navigate to="/hr/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}
