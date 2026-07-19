import { container, TOKENS } from "@/di/container";
import { ApiClient } from "./apiClient";

export type UserRole =
  | "admin"
  | "schoolAdmin"
  | "staff"
  | "teacher"
  | "student"
  | "parent";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

// Maps each role to the dashboard root it's allowed to land on. Used by the
// route guards so an authenticated user can only ever reach their own area.
export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/app/admin",
  schoolAdmin: "/app/school",
  staff: "/app/staff",
  teacher: "/app/teacher",
  student: "/app/student",
  parent: "/app/parent",
};

export class AuthService {
  private api = container.resolve<ApiClient>(TOKENS.ApiClient);
  private user: User | null = null;

  async login(email: string, password: string) {
    const result = await this.api.post<{ id: string; email: string; role?: UserRole }>(
      "/auth/login",
      { email, password }
    );
    // Fallback role until the backend returns one, so the guards never break.
    this.user = { ...result, role: result.role ?? "student" };
    return this.user;
  }

  logout() {
    this.user = null;
  }

  isAuthenticated() {
    return this.user !== null;
  }

  getUser(): User | null {
    return this.user;
  }

  getRole(): UserRole | null {
    return this.user?.role ?? null;
  }

  // Where this user belongs — their own dashboard. Authenticated users are
  // bounced here from public/auth routes, and away from other roles' areas.
  getHome(): string | null {
    return this.user ? ROLE_HOME[this.user.role] : null;
  }
}