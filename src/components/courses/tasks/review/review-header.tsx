"use client";

import { Button } from "@/components/ui/button";
import Task from "@/types/courses/i-task";
import { ArrowLeftIcon, BookOpenIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReviewHeaderProps {
    courseCode: string;
    task: Task;
}

const getTaskIcon = (type: Task["materialType"]) => {
            switch (type) {
                case 0:
                    return <BookOpenIcon className="h-8 w-8 text-green-500" />
                case 1:
                    return <BookOpenIcon className="h-8 w-8 text-blue-500" />
                default:
                    return <BookOpenIcon className="h-8 w-8" />
            }
        }

function ReviewHeader({ courseCode, task }: ReviewHeaderProps) {
    const router = useRouter();



    

    return (
        <div className="border-b">
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <Link href={`/courses/${courseCode}/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Course
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl flex items-center gap-2 font-bold ">{getTaskIcon(task.materialType)}{task.title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {task.maxPoints !== null && (
                            <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                Max points: {task.maxPoints}
                            </span>
                        )}
                        {task.dueDate && (
                            <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewHeader;