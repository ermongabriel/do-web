import { lazy, Suspense, type JSX } from "react"
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom"
import { ProtectedRoute, RoleRoute, PublicOnlyRoute } from "@/components/ProtectedRoute"
import { useService } from "@/di/context"
import { TOKENS } from "@/di/container"
import { AuthService } from "@/services/authService"
import Cursor from "@/components/Cursor"
import HashScroll from "@/components/HashScroll"
import ErrorBoundary from "@/components/ErrorBoundary"

// loader
import Loader from "@/components/Loader"

// Importing Error Pages
const NotFound = lazy(() => import("@/components/NotFound"))

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
const AiTutor = lazy(() => import("@/pages/marketing/ai-tutor"))

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

function withSuspense<P extends object>(
  Component: React.LazyExoticComponent<(props: P) => JSX.Element>,
  props?: P
) {
  return (
    <Suspense fallback={<Loader />}>
      <Component {...(props as P)} />
    </Suspense>
  )
}

// Authenticated users land on their own dashboard; unauthenticated users
// are sent to login. Keeps /app a single entry that fans out by role.
function DashboardHome() {
  const auth = useService<AuthService>(TOKENS.AuthService)
  if (!auth.isAuthenticated()) return <Navigate to="/auth/login" replace />
  return <Navigate to={auth.getHome() ?? "/auth/login"} replace />
}

// Root layout wraps the whole router so global pieces that depend on the
// Router context (useLocation in HashScroll) live INSIDE <RouterProvider>.
// Rendering HashScroll as a sibling of RouterProvider (as before) threw
// "useLocation() may be used only in the context of a <Router>", which
// crashed the entire tree and left a white screen.
function AppRoot() {
  return (
    <>
      <Cursor />
      <HashScroll />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <AppRoot />,
    children: [
      {
        path: "/",
        element: withSuspense(MarketingLayout),
        children: [
          { index: true, element: <Landing /> },
          { path: "pricing", element: <Pricing /> },
          { path: "ai-tutor", element: <AiTutor /> },
          { path: "about", element: <About /> },
          { path: "contact", element: <Contact /> },
        ],
      },
      {
        // Public, readable by anyone — no auth gate.
        path: "/legal",
        element: withSuspense(LegalLayout),
        children: [
          { path: "privacy", element: withSuspense(Privacy) },
          { path: "terms", element: withSuspense(Terms) },
          { path: "security", element: withSuspense(Security) },
        ],
      },
      {
        // Auth surfaces are for signed-out visitors only.
        path: "/auth",
        element: (
          <PublicOnlyRoute>
            <AuthLayout />
          </PublicOnlyRoute>
        ),
        children: [
          { path: "login", element: withSuspense(Login) },
          { path: "register", element: withSuspense(Register) },
          { path: "waitlist", element: withSuspense(Waitlist) },
        ],
      },
      {
        // Authenticated area. /app fans out to each role's own dashboard.
        // RoleRoute guards each branch so a user can only reach their own area.
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
          { path: "profile", element: withSuspense(Profile) },
          { path: "setting", element: withSuspense(Setting) },
        ],
      },
      {
        path: "school",
        element: <RoleRoute role="schoolAdmin" />,
        children: [
          { index: true, element: <RoleDashboard role="schoolAdmin" /> },
          { path: "profile", element: withSuspense(Profile) },
          { path: "setting", element: withSuspense(Setting) },
        ],
      },
      {
        path: "staff",
        element: <RoleRoute role="staff" />,
        children: [
          { index: true, element: <RoleDashboard role="staff" /> },
          { path: "profile", element: withSuspense(Profile) },
          { path: "setting", element: withSuspense(Setting) },
        ],
      },
      {
        path: "teacher",
        element: <RoleRoute role="teacher" />,
        children: [
          { index: true, element: <RoleDashboard role="teacher" /> },
          { path: "profile", element: withSuspense(Profile) },
          { path: "setting", element: withSuspense(Setting) },
        ],
      },
      {
        path: "student",
        element: <RoleRoute role="student" />,
        children: [
          { index: true, element: <RoleDashboard role="student" /> },
          { path: "profile", element: withSuspense(Profile) },
          { path: "setting", element: withSuspense(Setting) },
        ],
      },
      {
        path: "parent",
        element: <RoleRoute role="parent" />,
        children: [
          { index: true, element: <RoleDashboard role="parent" /> },
          { path: "profile", element: withSuspense(Profile) },
          { path: "setting", element: withSuspense(Setting) },
        ],
      },
    ],
  },
      {
        path: "*",
        element: withSuspense(NotFound, { code: 404 }),
      },
    ],
  },
])

const app = () => {
  return <RouterProvider router={router} />
}

export default app
