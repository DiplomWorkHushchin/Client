import { loginUser, logoutUser, updateUser } from '@/store/slices/auth-slice';
import api from '../interceptors/api-interceptor';
import LoginUserDTO from "@/DTOs/login-user-dto";
import { AppDispatch, store } from "@/store/store";
import { toast } from 'sonner';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import axios from 'axios';


export const loginAsync = async (loginUserDto: LoginUserDTO, dispatch: AppDispatch, router: AppRouterInstance) => {
    try {
        const response = await api.post('/auth/login', loginUserDto);

        if (response.status === 200) {
            dispatch(loginUser(response.data));
            toast.success("Login successful");
            router.replace("/dashboard");
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");
    }
}

export const logoutAsync = async () => {
    try {
        await api.post('/auth/logout');
    } finally {
        toast.success("Logout successful");
        store.dispatch(logoutUser());
    }
}

export const loginViaGoogleAsync = async (token: string, dispatch: AppDispatch, router: AppRouterInstance) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login-via-google`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        if (response.status === 200) {
            dispatch(loginUser(response.data));
            toast.success("Login successful");
            router.replace("/dashboard");
        }

        return response;
    } catch (error: any) {
        if (!axios.isAxiosError(error))
            toast.error("Unexpected error occurred.");
    }
}

