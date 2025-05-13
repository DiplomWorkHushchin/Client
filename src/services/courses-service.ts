import { CreateCourseDTO } from '@/DTOs/create-course-dto';
import api from '../interceptors/api-interceptor';
import axios from 'axios';
import { toast } from 'sonner';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const createCourseAsync = async (createCourseDto: CreateCourseDTO, router: AppRouterInstance) => {
    try {
        const formData = new FormData();

        formData.append("Title", createCourseDto.title);
        formData.append("Description", createCourseDto.description);
        formData.append("Category", createCourseDto.category);
        formData.append("Credits", String(createCourseDto.credits));
        formData.append("Status", createCourseDto.status);
        formData.append("StartDate", createCourseDto.startDate);
        formData.append("EndDate", createCourseDto.endDate);

        if (createCourseDto.coverImage) {
            formData.append("CoverBanner", createCourseDto.coverImage);
        }

        if (createCourseDto.instructors) {
            createCourseDto.instructors.forEach((instructor, index) => {
                formData.append(`Instructors[${index}].FirstName`, instructor.firstName);
                formData.append(`Instructors[${index}].LastName`, instructor.lastName);
                if (instructor.fatherName) {
                    formData.append(`Instructors[${index}].FatherName`, instructor.fatherName);
                }
                formData.append(`Instructors[${index}].Email`, instructor.email);
                formData.append(`Instructors[${index}].UserName`, instructor.userName);
                if (instructor.photoUrl) {
                    formData.append(`Instructors[${index}].PhotoUrl`, instructor.photoUrl);
                }
                formData.append(`Instructors[${index}].CanCreateAssignments`, String(instructor.canCreateAssignments));
                formData.append(`Instructors[${index}].CanModifyAssignments`, String(instructor.canModifyAssignments));
                formData.append(`Instructors[${index}].CanGradeStudents`, String(instructor.canGradeStudents));
                formData.append(`Instructors[${index}].CanManageUsers`, String(instructor.canManageUsers));
            });
        }

        if (createCourseDto.schedule) {
            createCourseDto.schedule.forEach((entry, index) => {
                formData.append(`Schedule[${index}].Day`, entry.day);
                formData.append(`Schedule[${index}].Time`, entry.time);
                formData.append(`Schedule[${index}].Location`, entry.location);
            });
        }

        console.log("FormData:", formData);

        const response = await api.post('/courses/create', formData);


        if (response.status === 201) {
            toast.success("Course created successfully");
            router.push("/courses");
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.message || error.response?.data || "Unexpected error occurred.";
            toast.error(errorMessage);
        } else {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getAllCoursesAsync = async () => {
    try {
        const response = await api.get('/courses');

        if (response.status === 200) {
            return response.data;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error))
            toast.error("Unexpected error occurred.");
    }
}

export const getCourseByCode = async (courseCode: string) => {
    try {
        const response = await api.get(`/courses/code/${courseCode}`);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");
    }
}

export const getAllCourseInstructorsAsync = async (courseCode: string) => {
    try {
        const response = await api.get(`/courses/teachers/${courseCode}`);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");

        return null;
    }
}

export const getAllCourseStudentsAsync = async (courseCode: string) => {
    try {
        const response = await api.get(`/courses/students/${courseCode}`);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) 
            toast.error("Unexpected error occurred.");

        return null;
    }
}

export const addNewUserToCourseAsync = async (courseCode: string, userEmail: string) => {
    try {
        const response = await api.put(`/courses/add-user`, {
            courseCode,
            userEmail
        });

        if (response.status === 204) {
            toast.success("User added successfully");
            return true;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        } 
    }
}

export const updateCourseAsync = async (courseCode: string, createCourseDto: CreateCourseDTO, router: AppRouterInstance) => {
    try {
        const formData = new FormData();

        formData.append("CourseCode", courseCode);
        formData.append("Title", createCourseDto.title);
        formData.append("Description", createCourseDto.description);
        formData.append("Category", createCourseDto.category);
        formData.append("Credits", String(createCourseDto.credits));
        formData.append("Status", createCourseDto.status);
        formData.append("StartDate", createCourseDto.startDate);
        formData.append("EndDate", createCourseDto.endDate);

        if (createCourseDto.coverImage) {
            formData.append("CoverBanner", createCourseDto.coverImage);
        }

        if (createCourseDto.schedule) {
            createCourseDto.schedule.forEach((entry, index) => {
                formData.append(`Schedule[${index}].Day`, entry.day);
                formData.append(`Schedule[${index}].Time`, entry.time);
                formData.append(`Schedule[${index}].Location`, entry.location);
            });
        }

        const response = await api.put('/courses/edit', formData);

        if (response.status === 204) {
            toast.success("Course updated successfully");
            router.push("/courses/" + courseCode);
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}