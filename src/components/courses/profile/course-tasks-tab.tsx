"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpenIcon, FilterIcon, InfoIcon, PlusCircleIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Course } from "@/types/courses/i-course"
import { useSelector } from "react-redux"
import IUser from "@/types/i-user"
import { RootState } from "@/store/store"
import Link from "next/link"
import Task from "@/types/courses/i-task"
import { getTasksAsync } from "@/services/materials-service"
import { format } from "date-fns"


interface CourseTasksTabProps {
  course: Course
}

export function CourseTasksTab({ course }: CourseTasksTabProps) {
  const user: IUser | null = useSelector((state: RootState) => state.user.user);
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [tasks, setTasks] = useState<Task[]>([])

  const isAdmin = user?.userRoles.includes("admin");
  const isOwner = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.owner === true
  );

  const isCanCreateAssignments = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.canCreateAssignments === true
  )

  const canCreateAssignments = isAdmin || isOwner || isCanCreateAssignments

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCourses = async () => {
      const taskData = await getTasksAsync(course.code);
      if (taskData) setTasks(taskData);
      console.log(taskData);
    };

    fetchCourses();

  }, [])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    const materialTypeMap: { [key: string]: string } = {
      "0": "lecture",
      "1": "task"
    };

    const matchesType = typeFilter === "all" || materialTypeMap[String(task.materialType)] === typeFilter;

    return matchesSearch && matchesType
  })

  // Helper function to get task icon based on type
  const getTaskIcon = (type: Task["materialType"]) => {
    switch (type) {
      case 0:
        return <BookOpenIcon className="h-4 w-4 text-green-500" />
      case 1:
        return <BookOpenIcon className="h-4 w-4 text-blue-500" />
      default:
        return <BookOpenIcon className="h-4 w-4" />
    }
  }

  // Helper function to get status badge color
  // const getStatusBadgeColor = (status: Task["status"]) => {
  //   switch (status) {
  //     case "completed":
  //       return "bg-green-500"
  //     case "in-progress":
  //       return "bg-blue-500"
  //     case "not-started":
  //       return "bg-gray-500"
  //     default:
  //       return "bg-gray-500"
  //   }
  // }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Course Tasks</CardTitle>
            <CardDescription>View and manage all tasks for this course</CardDescription>
          </div>
          {canCreateAssignments && (
            <Link href={`/courses/${course.code}/tasks/create`}>
              <Button size="sm">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </Link>)}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lecture">Lectures</SelectItem>
                  <SelectItem value="task">Tasks</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Reset filters</span>
              </Button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTaskIcon(task.materialType)}
                      <h3 className="font-medium">{task.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Due: {format(task.dueDate, "dd.MM.yyyy")}</Badge>
                    </div>
                  </div>
                  <p className="text-md  text-muted-foreground line-clamp-2">{task.description}</p>
                  <div className="mt-4 w-full flex items-end justify-between">
                    {task.materialsFiles && task.materialsFiles.length > 0 ? (
                      <Link href={`/courses/${course.code}/tasks/${task.id}/materials`}>
                        <Badge variant="outline">
                          <InfoIcon className="mr-2 h-2 w-2" />
                          <p className="mr-2 text-sm">
                            {task.materialsFiles.length} {task.materialsFiles.length > 1 ? "Materials" : "Material"}
                          </p>
                        </Badge>
                      </Link>
                    ) : <div />}

                    <Link href={`/courses/${course.code}/tasks/${task.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
