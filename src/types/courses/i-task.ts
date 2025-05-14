export default interface Task {
    courseCode(courseCode: any, id: string): unknown;
    id: string;
    title: string;
    description: string;
    materialType: number;
    dueDate: Date;
    maxPoints?: number;
    materialsFiles?: {
        name: string;
        filePath: string;
    }[];
}