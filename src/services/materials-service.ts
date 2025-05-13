import CreateTaskDTO from "@/DTOs/create-task-dto";
import api from "@/interceptors/api-interceptor";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";


export const createTaskAsync = async (courseCode: string, createTaskDto: CreateTaskDTO, router: AppRouterInstance) => {
    try {
        const formData = new FormData();

        formData.append("Title", createTaskDto.title);
        formData.append("Description", createTaskDto.description);
        formData.append("MaterialType", createTaskDto.type);
        formData.append("DueDate", createTaskDto.dueDate.toISOString());
        formData.append("DueTime", createTaskDto.dueTime);
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