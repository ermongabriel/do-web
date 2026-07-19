import { Navigate, Outlet } from "react-router-dom";
import { useService } from "@/di/context";
import { TOKENS } from "@/di/container";
import { AuthService, type UserRole } from "@/services/authService";
import type { ReactNode } from "react";

// Auth gate: blocks unauthenticated visitors and sends them to login.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useService<AuthService>(TOKENS.AuthService);
  if (!auth.isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
}

// Role gate (used as a layout element): only lets a user whose role matches
// `role` into this subtree. Others are bounced to their own dashboard, so a
// student can never reach the school/teacher area and vice versa.
export function RoleRoute({ role }: { role: UserRole }) {
  const auth = useService<AuthService>(TOKENS.AuthService);

  if (!auth.isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  if (auth.getRole() !== role) {
    return <Navigate to={auth.getHome() ?? "/auth/login"} replace />;
  }

  return <Outlet />;
}

// Inverse gate: keeps authenticated users out of public/auth surfaces
// (login, register, waitlist). They're redirected to their own dashboard.
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const auth = useService<AuthService>(TOKENS.AuthService);

  if (auth.isAuthenticated()) {
    return <Navigate to={auth.getHome() ?? "/"} replace />;
  }

  return <>{children}</>;
}
