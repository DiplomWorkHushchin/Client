"use client";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { Course } from "@/types/courses/i-course";
import Task from "@/types/courses/i-task";
import { ITaskSubmission } from "@/types/courses/i-task-submittion";
import IUser from "@/types/i-user";
import { ArrowLeftIcon, BookOpenIcon, CheckCircle, Edit2Icon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

interface TaskHeaderProps {
    course: Course
    task: Task
    courseCode: string
    submission: ITaskSubmission | null
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

function TaskHeader({ course, task, courseCode, submission }: TaskHeaderProps) {
    const user: IUser | null = useSelector((state: RootState) => state.user.user);


    const isAdmin = user?.userRoles.includes("admin");
    const isOwner = course.instructors.some(
        (instructor) => instructor.email === user?.email && instructor.owner === true
    );
    const isCanModifyAssignments = course.instructors.some(
        (instructor) => instructor.email === user?.email && instructor.canModifyAssignments === true
    )
    const canEdit = isAdmin || isOwner || isCanModifyAssignments

    const isCanGradeStudents = course.instructors.some(
        (instructor) => instructor.email === user?.email && instructor.canGradeStudents === true
    )

    const canGrade = isAdmin || isOwner || isCanGradeStudents

    
    return (
        <div className="border-b">
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">

                    <Link href={`/courses/${courseCode}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Course
                        </Button>
                    </Link>
                    
                    
                    <div className="flex items-center gap-2">
                    {canGrade ? (
                        <Link href={`/courses/${courseCode}/tasks/${task.id}/review`}>
                            <Button variant="secondary">
                                <CheckCircle className="h-5 w-5" />
                                 View submissions
                            </Button>
                        </Link>
                    ) : null }

                    {canEdit ? (
                        <Link href={`/courses/${courseCode}/tasks/${task.id}/edit`}>
                            <Button >
                                <Edit2Icon className="h-5 w-5" />
                                Edit task
                            </Button>
                        </Link>
                    ) : (
                       null
                    )}
                    </div>

                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl flex gap-2 font-bold items-center">{getTaskIcon(task.materialType)}{task.title}</h1>
                        {submission && submission.points && (
                            <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                {submission.points} / {task.maxPoints} points
                            </span>
                        )}
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

export default TaskHeader;