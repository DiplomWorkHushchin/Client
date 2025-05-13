"use client"

import { useState } from "react"
import { BookOpenIcon, FilterIcon, InfoIcon, PlusCircleIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Course } from "@/types/courses/i-course"
import { useSelector } from "react-redux"
import IUser from "@/types/i-user"
import { RootState } from "@/store/store"
import Link from "next/link"


interface CourseTasksTabProps {
  course: Course
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  type: "lecture" | "assignment" | "quiz" | "project" | "exam"
  status: "completed" | "in-progress" | "not-started"
  materials: string[]
}

export function CourseTasksTab({ course }: CourseTasksTabProps) {
  const user: IUser | null = useSelector((state: RootState) => state.user.user);
  const [searchQuery, setSearchQuery] = useState("")
  const [materialFilter, setMaterialFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const isAdmin = user?.userRoles.includes("admin");
  const isOwner = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.owner === true
  );

  const isCanCreateAssignments = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.canCreateAssignments === true
  )

  const canCreateAssignments = isAdmin || isOwner || isCanCreateAssignments


  // Get unique materials from tasks
  // const materials = ["all", ...new Set(tasks.flatMap((task) => task.materials))]

  // // Filter tasks based on search query and filters
  // const filteredTasks = tasks.filter((task) => {
  //   const matchesSearch =
  //     task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     task.description.toLowerCase().includes(searchQuery.toLowerCase())
  //   const matchesMaterial = materialFilter === "all" || task.materials.includes(materialFilter)
  //   const matchesType = typeFilter === "all" || task.type === typeFilter
  //   const matchesStatus = statusFilter === "all" || task.status === statusFilter

  //   return matchesSearch && matchesMaterial && matchesType && matchesStatus
  // })

  // Helper function to get task icon based on type
  const getTaskIcon = (type: Task["type"]) => {
    switch (type) {
      case "lecture":
        return <BookOpenIcon className="h-4 w-4 text-blue-500" />
      case "assignment":
        return <BookOpenIcon className="h-4 w-4 text-green-500" />
      case "quiz":
        return <InfoIcon className="h-4 w-4 text-yellow-500" />
      case "project":
        return <BookOpenIcon className="h-4 w-4 text-purple-500" />
      case "exam":
        return <InfoIcon className="h-4 w-4 text-red-500" />
      default:
        return <BookOpenIcon className="h-4 w-4" />
    }
  }

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "not-started":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Course Tasks</CardTitle>
            <CardDescription>View and manage all tasks for this course</CardDescription>
          </div>
          <Link href={`/courses/${course.code}/tasks/create`}>
            <Button size="sm">
              <PlusCircleIcon className="mr-2 h-4 w-4"/>
              Create Task
            </Button>
          </Link>
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
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Material" />
                </SelectTrigger>
                <SelectContent>
                  {/* {materials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material === "all" ? "All Materials" : material}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lecture">Lectures</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="quiz">Quizzes</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="exam">Exams</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">More filters</span>
              </Button>
            </div>
          </div>

          {/* Status Tabs */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="not-started">Not Started</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tasks List */}
          <div className="space-y-4">
            {/* {filteredTasks.length === 0 ? (
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
                      {getTaskIcon(task.type)}
                      <h3 className="font-medium">{task.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusBadgeColor(task.status)} text-white`}>
                        {task.status === "completed"
                          ? "Completed"
                          : task.status === "in-progress"
                            ? "In Progress"
                            : "Not Started"}
                      </Badge>
                      <Badge variant="outline">Due: {task.dueDate}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.materials.map((material) => (
                      <Badge key={material} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              ))
            )} */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
