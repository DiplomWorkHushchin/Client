import api from '../interceptors/api-interceptor';
import LoginUserDTO from "@/DTOs/login-user-dto";


export const loginAsync = async (loginUserDto: LoginUserDTO) => {
    const response = await api.post('/auth/login', loginUserDto);

    return response.data;
}