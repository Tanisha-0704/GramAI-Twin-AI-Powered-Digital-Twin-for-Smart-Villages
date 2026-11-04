
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import { NotificationProvider } from "./notifications/NotificationProvider";

const Login = lazy(() => import("./pages/Login"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Villages = lazy(() => import("./pages/Villages"));
const Map = lazy(() => import("./pages/MapExplorer"));
const AIPrediction = lazy(() => import("./pages/AIPrediction"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Reports = lazy(() => import("./pages/Reports"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const Schemes = lazy(() => import("./pages/Schemes"));
const SchemeDetail = lazy(() => import("./pages/SchemeDetail"));
const SchemeEligibility = lazy(() => import("./pages/SchemeEligibility"));
const SchemeManage = lazy(() => import("./pages/SchemeManage"));
const SchemeReview = lazy(() => import("./pages/SchemeReview"));
const SavedSchemes = lazy(() => import("./pages/SavedSchemes"));
const ApplicationNew = lazy(() => import("./pages/ApplicationNew"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const ApplicationDetail = lazy(() => import("./pages/ApplicationDetail"));
const ApplicationReviewQueue = lazy(() => import("./pages/ApplicationReviewQueue"));
const ApplicationWorkflowManage = lazy(() => import("./pages/ApplicationWorkflowManage"));
const GrievanceNew = lazy(() => import("./pages/GrievanceNew"));
const MyGrievances = lazy(() => import("./pages/MyGrievances"));
const GrievanceQueue = lazy(() => import("./pages/GrievanceQueue"));
const GrievanceDetail = lazy(() => import("./pages/GrievanceDetail"));
const GrievanceWorkflowManage = lazy(() => import("./pages/GrievanceWorkflowManage"));
const Notifications = lazy(() => import("./pages/Notifications"));
const SystemUpdates = lazy(() => import("./pages/SystemUpdates"));
const AdminAudit = lazy(() => import("./pages/AdminAudit"));
const AdminMonitoring = lazy(() => import("./pages/AdminMonitoring"));
const AdminModels = lazy(() => import("./pages/AdminModels"));
const AdminDataQuality = lazy(() => import("./pages/AdminDataQuality"));

function LoginRoute() {
  const { portal } = useParams();
  return <Login key={portal || "chooser"} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <Suspense fallback={<div role="status" className="grid min-h-screen place-items-center text-slate-600">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<LoginRoute />} />
          <Route path="/login/:portal" element={<LoginRoute />} />
          <Route element={<RequireAuth />}>
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/villages" element={<Villages />} />
            <Route path="/map" element={<Map />} />
            <Route path="/predictions" element={<AIPrediction />} />
            <Route path="/chatbot" element={<AIAssistant />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/updates" element={<SystemUpdates />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/eligibility" element={<SchemeEligibility />} />
            <Route path="/schemes/saved" element={<SavedSchemes />} />
            <Route
              path="/schemes/review"
              element={
                <RequireRole roles={["BLOCK_OFFICER", "HIGHER_OFFICIAL", "SYSTEM_ADMIN"]}>
                  <SchemeReview />
                </RequireRole>
              }
            />
            <Route
              path="/schemes/manage"
              element={
                <RequireRole roles={["SARPANCH", "BLOCK_OFFICER", "HIGHER_OFFICIAL", "SYSTEM_ADMIN"]}>
                  <SchemeManage />
                </RequireRole>
              }
            />
            <Route path="/schemes/:schemeId/eligibility" element={<SchemeEligibility />} />
            <Route path="/schemes/:schemeId" element={<SchemeDetail />} />
            <Route
              path="/villager/applications/new"
              element={
                <RequireRole role="LOCAL_VILLAGER">
                  <ApplicationNew />
                </RequireRole>
              }
            />
            <Route
              path="/villager/my-applications"
              element={
                <RequireRole role="LOCAL_VILLAGER">
                  <MyApplications />
                </RequireRole>
              }
            />
            <Route
              path="/sarpanch/applications"
              element={
                <RequireRole role="SARPANCH">
                  <ApplicationReviewQueue />
                </RequireRole>
              }
            />
            <Route
              path="/block-officer/applications"
              element={
                <RequireRole role="BLOCK_OFFICER">
                  <ApplicationReviewQueue />
                </RequireRole>
              }
            />
            <Route
              path="/higher-official/applications"
              element={
                <RequireRole role="HIGHER_OFFICIAL">
                  <ApplicationReviewQueue />
                </RequireRole>
              }
            />
            <Route
              path="/admin/application-workflows"
              element={
                <RequireRole role="SYSTEM_ADMIN">
                  <ApplicationWorkflowManage />
                </RequireRole>
              }
            />
            <Route
              path="/villager/grievances/new"
              element={
                <RequireRole role="LOCAL_VILLAGER">
                  <GrievanceNew />
                </RequireRole>
              }
            />
            <Route
              path="/villager/my-grievances"
              element={
                <RequireRole role="LOCAL_VILLAGER">
                  <MyGrievances />
                </RequireRole>
              }
            />
            <Route
              path="/sarpanch/grievances"
              element={
                <RequireRole role="SARPANCH">
                  <GrievanceQueue />
                </RequireRole>
              }
            />
            <Route
              path="/block-officer/grievances"
              element={
                <RequireRole role="BLOCK_OFFICER">
                  <GrievanceQueue />
                </RequireRole>
              }
            />
            <Route
              path="/higher-official/grievances"
              element={
                <RequireRole role="HIGHER_OFFICIAL">
                  <GrievanceQueue />
                </RequireRole>
              }
            />
            <Route
              path="/admin/grievance-workflows"
              element={
                <RequireRole role="SYSTEM_ADMIN">
                  <GrievanceWorkflowManage />
                </RequireRole>
              }
            />
            <Route path="/grievances/:grievanceId" element={<GrievanceDetail />} />
            <Route path="/applications/:applicationId" element={<ApplicationDetail />} />
            <Route
              path="/admin/users"
              element={
                <RequireRole role="SYSTEM_ADMIN">
                  <AdminUsers />
                </RequireRole>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <RequireRole role="SYSTEM_ADMIN">
                  <AdminAudit />
                </RequireRole>
              }
            />
            <Route
              path="/admin/monitoring"
              element={
                <RequireRole role="SYSTEM_ADMIN">
                  <AdminMonitoring />
                </RequireRole>
              }
            />
            <Route
              path="/admin/models"
              element={
                <RequireRole role="SYSTEM_ADMIN">
                  <AdminModels />
                </RequireRole>
              }
            />
            <Route
              path="/admin/data-quality"
              element={
                <RequireRole role="SYSTEM_ADMIN">
                  <AdminDataQuality />
                </RequireRole>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
