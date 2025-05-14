import { RegisterDTO } from "@/DTOs/register-dto";
import UpdateUserProfileDTO from "@/DTOs/update-user-profile-dto";
import api from "@/interceptors/api-interceptor";
import { updateUser, updateUserData } from "@/store/slices/auth-slice";
import { AppDispatch } from "@/store/store";
import axios from "axios";
import { toast } from "sonner";

export const getUserAsync = async (username: string) => {
    const response = await api.get(`/users/${username}`);

    return response.data;
}


export const putUserPhotoAsync = async (file: File, dispatch: AppDispatch) => {
    try {
        const formData = new FormData();
        formData.append("photo", file);

        const response = await api.put(`/users/upload-photo`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        if (response.status === 200) {
            dispatch(updateUserData(response.data));

            toast.success("Profile picture updated successfully!");
        } else {
            toast.error("Failed to update profile picture.");

        }

    } catch (error: any) {
        if (!axios.isAxiosError(error))
            toast.error("Unexpected error occurred.");
    }
}

export const patchUserEditAsync = async (userUpdated: UpdateUserProfileDTO, dispatch: AppDispatch) => {
    try {
        const response = await api.patch(`/users/update-user`, userUpdated);
        dispatch(updateUser(response.data));
        toast.success("Profile updated successfully!");
        return response;
    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");
    }
};

export const findUserLiveAsync = async (query: string) => {
    try {
        const response = await api.post(`/users/search`, { query: query });

        if (response.status === 200) {
            return response.data;
        } else if (response.status === 204) {
            return null;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");
    }
}

export const getUserByPages = async (currentPage: number, count: number) => {
    try {
        const response = await api.get(`/users/paginations/${currentPage}/${count}`);

        if (response.status === 200) {
            return response.data;
        } else if (response.status === 204) {
            return null;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");
    }
}

export const registerUserAsync = async (registerDTO: RegisterDTO) => {
    try {
        const response = await api.post(`/auth/register`, registerDTO);

        if (response.status === 200) {
            toast.success("User registered successfully!");
            return response.data;
        } else if (response.status === 204) {
            return null;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");
    }
}