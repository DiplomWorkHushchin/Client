"use client"

import { useState, useEffect, use, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Download, FileText, Filter, Search, SortAsc, SortDesc, AlertCircle, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTaskByIdAsync, getTaskSubmissionAsync, getTaskSubmissionListAsync, ReviewSubmissionAsync } from "@/services/materials-service"
import Task from "@/types/courses/i-task"
import ReviewHeader from "@/components/courses/tasks/review/review-header"
import TaskMaterials from "@/components/courses/tasks/task-materials"
import IUser from "@/types/i-user"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import ReviewBlock from "@/components/courses/tasks/review/review-block"
import { getAllCourseStudentsAsync } from "@/services/courses-service"
import { ITaskSubmission } from "@/types/courses/i-task-submittion"
import { ITaskReview } from "@/DTOs/review-dto"



export default function AssignmentGradingPage({ params }: { params: Promise<{ courseCode: string, taskId: string }> }) {
    const userState: IUser | null = useSelector((state: RootState) => state.user.user);
    const unwrappedParams = use(params)
    const router = useRouter()
    const [task, setTask] = useState<Task | null>(null)
    const [students, setStudents] = useState<IUser[]>([])
    const [submissions, setSubmissions] = useState<ITaskSubmission[]>([])
    const [pointsMap, setPointsMap] = useState<Record<string, number | null>>({});


    const hasFetched = useRef(false);

    async function fetchAssignmentData(courseId: string, taskId: string) {
        const response = await getTaskByIdAsync(courseId, taskId)
        if (response) {
            setTask(response)
        }

        const submissionsData = await getTaskSubmissionListAsync(courseId, taskId)
        if (submissionsData) {
            setSubmissions(submissionsData)
        }

        const studentsData = await getAllCourseStudentsAsync(courseId)
        if (studentsData) {
            setStudents(studentsData)
        }


        console.log("Submissions", submissionsData)
        console.log("Students", studentsData)
    }
    // Fetch data
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchAssignmentData(unwrappedParams.courseCode, unwrappedParams.taskId)
    }, [])


    async function handleSaveAllChanges() {
        const taskSubmissionDto: ITaskReview[] = submissions
            .filter((s) => s.user?.userName)
            .map((submission) => {
                const userName = submission.user!.userName;
                const points = pointsMap[userName];

                return {
                    submissionId: Number(submission.id),
                    points: points !== undefined ? points : null,
                };
            });

        await ReviewSubmissionAsync(unwrappedParams.courseCode, unwrappedParams.taskId, taskSubmissionDto);

        fetchAssignmentData(unwrappedParams.courseCode, unwrappedParams.taskId)

        console.log("Updated Submissions", taskSubmissionDto);
    }

    return (
        <div className="flex flex-1 flex-col">
            {task && task && (
                <ReviewHeader
                    task={task}
                    courseCode={unwrappedParams.courseCode}
                />
            )}

            <div className="@container/main flex flex-1 flex-col p-6">
                {task && <TaskMaterials task={task} />}

                {task && userState?.userRoles.some(role => role === "Admin" || role === "Teacher") ? (
                    <ReviewBlock
                        students={students}
                        submissions={submissions}
                        maxPoints={task.maxPoints}
                        handleSaveAllChanges={handleSaveAllChanges}
                        setPointsMap={setPointsMap}
                        pointsMap={pointsMap}
                    />
                    
                ) : null}
            </div>
        </div>


    )
}
