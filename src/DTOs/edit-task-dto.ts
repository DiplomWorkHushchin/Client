export interface EditTaskDTO {
    title: string;
    description: string;
    type: "lecture" | "task";
    dueDate: Date;
    dueTime?: string;
    maxPoints?: number;
    updatedMaterials?: {
        name: string;
        filePath: string;
    }[];
    materials?: {
        name: string;
        file: File;
    }[];
}