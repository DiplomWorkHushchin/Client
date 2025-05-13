export interface Instructor {
    userName: string
    firstName: string
    lastName: string
    fatherName: string
    email: string
    photoUrl: string | null
    owner?: boolean
    canCreateAssignments?: boolean
    canModifyAssignments?: boolean
    canGradeStudents?: boolean
    canManageUsers?: boolean
}

