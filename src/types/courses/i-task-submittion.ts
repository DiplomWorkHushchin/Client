import IUser from "../i-user";

export interface ITaskSubmission {
    id: string;
    points: number | null;
    submissionFiles: {
        name: string;
        filePath: string;
    }[];
    user?: IUser;
}