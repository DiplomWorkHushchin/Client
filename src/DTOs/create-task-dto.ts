export default interface CreateTaskDTO {
    title: string
    description: string
    type: "lecture" | "task"
    dueDate: Date
    dueTime?: string
    maxPoints?: number
    materials?: {
        name: string
        file: File
    }[]
}