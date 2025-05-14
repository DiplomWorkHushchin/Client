import CreateTaskDTO from "@/DTOs/create-task-dto";
import { EditTaskDTO } from "@/DTOs/edit-task-dto";
import { ITaskReview } from "@/DTOs/review-dto";
import TaskSubmitDTO from "@/DTOs/task-submit-dto";
import api from "@/interceptors/api-interceptor";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";


export const createTaskAsync = async (courseCode: string, createTaskDto: CreateTaskDTO, router: AppRouterInstance) => {
    try {
        const formData = new FormData();

        const dateOnly = createTaskDto.dueDate.toDateString();

        formData.append("Title", createTaskDto.title);
        formData.append("Description", createTaskDto.description);
        formData.append("MaterialType", createTaskDto.type);
        formData.append("DueDate", dateOnly);
        formData.append("DueTime", "23:59");
        if (createTaskDto.maxPoints) {
            formData.append("MaxPoints", createTaskDto.maxPoints.toString());
        }

        if (createTaskDto.materials) {
            createTaskDto.materials.forEach((material) => {
                formData.append("MaterialsFiles", material.file);
            });
        }

        const response = await api.post(`/courses/${courseCode}/tasks/create`, formData);

        if (response.status === 201) {
            toast.success("Task created successfully");
            router.push(`/courses/${courseCode}`);
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getTasksAsync = async (courseCode: string) => {
    try {
        const response = await api.get(`/courses/${courseCode}/tasks`);

        if (response.status === 200)
            return response.data;

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getTaskByIdAsync = async (courseCode: string, taskId: string) => {
    try {
        const response = await api.get(`/courses/${courseCode}/tasks/${taskId}`);

        if (response.status === 200)
            return response.data;

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const deleteTaskAsync = async (courseCode: string, taskId: string, router: AppRouterInstance) => {
    try {
        const response = await api.delete(`/courses/${courseCode}/tasks/${taskId}`);

        if (response.status === 204) {
            toast.success("Task deleted successfully");
            router.replace(`/courses/${courseCode}`);
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const editTaskAsync = async (courseCode: string, taskId: string, createTaskDto: EditTaskDTO, router: AppRouterInstance) => {
    try {
        const formData = new FormData();

        const dateOnly = createTaskDto.dueDate.toDateString();

        formData.append("Title", createTaskDto.title);
        formData.append("Description", createTaskDto.description);
        formData.append("Type", createTaskDto.type);
        formData.append("DueDate", dateOnly);
        formData.append("DueTime", "23:59");
        if (createTaskDto.maxPoints) {
            formData.append("MaxPoints", createTaskDto.maxPoints.toString());
        }

        if (createTaskDto.updatedMaterials) {
            createTaskDto.updatedMaterials.forEach((material) => {
                formData.append("UpdatedMaterials", material.filePath);
            });
        }

        if (createTaskDto.materials) {
            createTaskDto.materials.forEach((material) => {
                formData.append("Materials", material.file);
            });
        }

        console.log(formData);

        const response = await api.put(`/courses/${courseCode}/tasks/${taskId}`, formData);

        if (response.status === 204) {
            toast.success("Task updated successfully");
            router.push(`/courses/${courseCode}/tasks/${taskId}`);
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const submitTaskAsync = async (courseCode: string, taskId: string, taskSubmitDto: TaskSubmitDTO) => {
    try {
        const formData = new FormData();

        if (taskSubmitDto.files) {
            taskSubmitDto.files.forEach((file) => {
                formData.append("Files", file);
            });
        } else {
            formData.append("Files", JSON.stringify([]));
        }

        const response = await api.post(`/courses/${courseCode}/tasks/${taskId}/submit`, formData);

        if (response.status === 201) {
            toast.success("Task submitted successfully");
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const deleteTaskSubmissionAsync = async (courseCode: string, taskId: string) => {
    try {
        const response = await api.delete(`/courses/${courseCode}/tasks/${taskId}/submission`);

        if (response.status === 204) {
            toast.success("Task submission deleted successfully");
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getTaskSubmissionAsync = async (courseCode: string, taskId: string) => {
    try {
        const response = await api.get(`/courses/${courseCode}/tasks/${taskId}/submission`);

        if (response.status === 200) {
            return response.data;
        } else if (response.status === 204) {
            return null;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getTaskSubmissionListAsync = async (courseCode: string, taskId: string) => {
    try {
        const response = await api.get(`/courses/${courseCode}/tasks/${taskId}/submission/review`);

        if (response.status === 200) {
            return response.data;
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const ReviewSubmissionAsync = async (courseCode: string, taskId: string, submissionRevies: ITaskReview[]) => {
    try {
        const response = await api.put(`/courses/${courseCode}/tasks/${taskId}/submission/review`, submissionRevies);

        if (response.status === 204) {
            toast.success("Task reviewed successfully");
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}