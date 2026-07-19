import { lazy, type JSX } from "react"
import { Navigate } from "react-router-dom"
import { ProtectedRoute, RoleRoute, PublicOnlyRoute } from "@/components/ProtectedRoute"
import { useService } from "@/di/context"
import { TOKENS } from "@/di/container"
import { AuthService } from "@/services/authService"

// Importing Layouts
const MarketingLayout = lazy(() => import("@/layouts/marketing"))
const AuthLayout = lazy(() => import("@/layouts/auth"))
const LegalLayout = lazy(() => import("@/layouts/legal"))
const DashboardLayout = lazy(() => import("@/layouts/dashboard"))

// Import Marketing Layout pages
const Landing = lazy(() => import("@/pages/marketing/landing"))
const Pricing = lazy(() => import("@/pages/marketing/pricing"))
const About = lazy(() => import("@/pages/marketing/about"))
const Contact = lazy(() => import("@/pages/marketing/contact"))

// Import Legal pages
const Privacy = lazy(() => import("@/pages/legal/privacy"))
const Terms = lazy(() => import("@/pages/legal/terms"))
const Security = lazy(() => import("@/pages/legal/security"))

// Importing Auth layout pages
const Login = lazy(() => import("@/pages/auth/login"))
const Register = lazy(() => import("@/pages/auth/register"))
const Waitlist = lazy(() => import("@/pages/auth/waitlist"))

// Importing Dashboard pages
const RoleDashboard = lazy(() => import("@/pages/dashboard/RoleDashboard"))
const Profile = lazy(() => import("@/pages/dashboard/profile"))
const Setting = lazy(() => import("@/pages/dashboard/setting"))

function DashboardHome() {
  const auth = useService<AuthService>(TOKENS.AuthService)
  if (!auth.isAuthenticated()) return <Navigate to="/auth/login" replace />
  return <Navigate to={auth.getHome() ?? "/auth/login"} replace />
}

// Shared route tree — used by both the browser router (App.tsx) and the
// static prerender (entry-server.tsx) so SSG stays in sync with the SPA.
export const routes = [
  {
    path: "/",
    element: <MarketingLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "pricing", element: <Pricing /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "/legal",
    element: <LegalLayout />,
    children: [
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "security", element: <Security /> },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicOnlyRoute>
        <AuthLayout />
      </PublicOnlyRoute>
    ),
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "waitlist", element: <Waitlist /> },
    ],
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      {
        path: "admin",
        element: <RoleRoute role="admin" />,
        children: [
          { index: true, element: <RoleDashboard role="admin" /> },
          { path: "profile", element: <Profile /> },
          { path: "setting", element: <Setting /> },
        ],
      },
      {
        path: "school",
        element: <RoleRoute role="schoolAdmin" />,
        children: [
          { index: true, element: <RoleDashboard role="schoolAdmin" /> },
          { path: "profile", element: <Profile /> },
          { path: "setting", element: <Setting /> },
        ],
      },
      {
        path: "staff",
        element: <RoleRoute role="staff" />,
        children: [
          { index: true, element: <RoleDashboard role="staff" /> },
          { path: "profile", element: <Profile /> },
          { path: "setting", element: <Setting /> },
        ],
      },
      {
        path: "teacher",
        element: <RoleRoute role="teacher" />,
        children: [
          { index: true, element: <RoleDashboard role="teacher" /> },
          { path: "profile", element: <Profile /> },
          { path: "setting", element: <Setting /> },
        ],
      },
      {
        path: "student",
        element: <RoleRoute role="student" />,
        children: [
          { index: true, element: <RoleDashboard role="student" /> },
          { path: "profile", element: <Profile /> },
          { path: "setting", element: <Setting /> },
        ],
      },
      {
        path: "parent",
        element: <RoleRoute role="parent" />,
        children: [
          { index: true, element: <RoleDashboard role="parent" /> },
          { path: "profile", element: <Profile /> },
          { path: "setting", element: <Setting /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Landing />,
  },
] as unknown as JSX.Element

export { DashboardHome }
