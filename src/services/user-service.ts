import api from "@/interceptors/api-interceptor";
import {store} from "@/store/store";
import {updateUserData} from "@/store/slices/auth-slice";

export const getUserAsync = async (username: string) => {
    const response = await api.get(`/users/${username}`);

    return response.data;
}


export const putUserPhotoAsync = async (file: File) => {
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

    return response;
}