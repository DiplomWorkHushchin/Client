"use client";

import { useEffect, useRef, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react';

import TaskHeader from "@/components/courses/tasks/task-header";
import TaskMaterials from "@/components/courses/tasks/task-materials";
import TaskSubmission from "@/components/courses/tasks/task-submission";
import { getCourseByCode } from "@/services/courses-service";
import { deleteTaskSubmissionAsync, getTaskByIdAsync, getTaskSubmissionAsync, submitTaskAsync } from "@/services/materials-service";
import { Course } from "@/types/courses/i-course";
import Task from "@/types/courses/i-task";
import IUser from "@/types/i-user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ITaskSubmission } from "@/types/courses/i-task-submittion";

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}


function TaskPage({ params }: { params: Promise<{ courseCode: string, taskId: string }> }) {
    const userState: IUser | null = useSelector((state: RootState) => state.user.user);
    const unwrappedParams = use(params);
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [taskSubmission, setTaskSubmission] = useState<ITaskSubmission | null>(null);

    const attachFiles = (files: File[]) => {
        const newFiles = files.map(file => ({
            id: file.name + Date.now(),
            name: file.name,
            size: formatFileSize(file.size),
            file: file
        }));

        setAttachedFiles(prev => [...prev, ...newFiles]);
    }

    const hasFetched = useRef(false);

    const fetchData = async () => {
            const taskData = await getTaskByIdAsync(unwrappedParams.courseCode, unwrappedParams.taskId);
            if (taskData)
                setTask(taskData);

            const courseData = await getCourseByCode(unwrappedParams.courseCode);
            if (courseData)
                setCourse(courseData);


            if (userState?.userRoles.includes("Student")) {
                const taskSubmition = await getTaskSubmissionAsync(unwrappedParams.courseCode, unwrappedParams.taskId);
                setTaskSubmission(taskSubmition);

                if (taskSubmition) {
                    setIsCompleted(true);
                }
                else {
                    setIsCompleted(false);
                }
            }
        };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchData();
    }, [isCompleted]);

    // Handle file submission
    async function handleFileSubmit(files: File[], taskId: string) {
        const taskSubmitDto = {
            files: files,
        }

        await submitTaskAsync(
            unwrappedParams.courseCode,
            taskId,
            taskSubmitDto
        );

        await fetchData();
    };

    const removeFile = (id: string) => {
        setAttachedFiles(prev => prev.filter(file => file.id !== id));
    };

    // Handle task completion
    async function handleDeleteSubmissionCallback() {
        await deleteTaskSubmissionAsync(
            unwrappedParams.courseCode,
            unwrappedParams.taskId
        );

        setIsCompleted(false);
        setAttachedFiles([]);
        setTaskSubmission(null);
        await fetchData();
    };

    return (
        <div className="flex flex-1 flex-col">
            {task && course && (
                <TaskHeader
                    course={course}
                    task={task}
                    courseCode={unwrappedParams.courseCode}
                    submission={taskSubmission}
                />
            )}

            <div className="@container/main flex flex-1 flex-col p-6">
                {task && <TaskMaterials task={task} />}

                {task && userState?.userRoles.includes("Student") ? (
                    <TaskSubmission
                        task={task}
                        onFileSubmit={handleFileSubmit}
                        handleDeleteSubmissionCallback={handleDeleteSubmissionCallback}
                        isCompleted={isCompleted}
                        setIsCompleted={setIsCompleted}
                        attachedFiles={attachedFiles}
                        attachFiles={attachFiles}
                        removeFile={removeFile}
                        taskSubmission={taskSubmission}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default TaskPage;
