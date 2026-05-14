import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";
import { AuthTokens, User, LoginDto, RegisterDto } from "@/types";

export const authService = {
    async register(dto: RegisterDto): Promise<void> {
        await api.post(ENDPOINTS.auth.register, dto);
    },

    async login(dto: LoginDto): Promise<AuthTokens> {
        const response = await api.post(ENDPOINTS.auth.login, dto);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return response.data;
    },

    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem("refreshToken");
        await api.post(ENDPOINTS.auth.logout, { refreshToken });
    },

    async getMe(): Promise<User> {
        const { data } = await api.get<User>(ENDPOINTS.users.me);
        return data as User;
    },

    async loginAndGetUser(dto: LoginDto): Promise<User> {
        await authService.login(dto);

        return authService.getMe();
    },
};