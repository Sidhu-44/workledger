import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import CustomerDetail from "./pages/CustomerDetail";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Payments from "./pages/Payments";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WorkEntries from "./pages/WorkEntries";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Changelog from "./pages/Changelog";
import Landing from "./pages/Landing";
import AiAssistant from "./pages/AiAssistant";
export default function App() {
  const isNativeApp = Capacitor.isNativePlatform();
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public / auth routes */}
                <Route
                  path="/"
                  element={
                    isNativeApp ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Landing />
                    )
                  }
                />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/work-entries" element={<WorkEntries />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ/>}/>
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/changelog" element={<Changelog/>}/>
          <Route path="/ai-assistant" element={<AiAssistant />} />

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
