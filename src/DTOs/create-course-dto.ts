export interface CreateCourseDTO {
    title: string
    description: string
    category: string
    credits: number
    status: "in-progress" | "upcoming" | "completed"
    startDate: string
    endDate: string
    instructors?: {
        firstName: string
        lastName: string
        fatherName?: string
        email: string
        userName: string
        photoUrl?: string
        canCreateAssignments: boolean
        canModifyAssignments: boolean
        canGradeStudents: boolean
        canManageUsers: boolean
    }[]
    schedule?: {
        day: string
        time: string
        location: string
    }[]
    coverImage?: File | null
}