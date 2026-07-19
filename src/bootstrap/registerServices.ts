import { container, TOKENS } from "@/di/container";
import { ApiClient } from "@/services/apiClient";
import { AuthService } from "@/services/authService";

const registerServices = () => {
  container.register(TOKENS.ApiClient, () => new ApiClient());
  container.register(TOKENS.AuthService, () => new AuthService());
}
export default registerServices;