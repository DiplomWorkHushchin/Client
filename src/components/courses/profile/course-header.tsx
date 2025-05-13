"use client"

import Link from "next/link"
import { ArrowLeftIcon, Divide, MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Course } from "@/types/courses/i-course"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import IUser from "@/types/i-user"


interface CourseHeaderProps {
  course: Course
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const user: IUser | null = useSelector((state: RootState) => state.user.user);

  const isAdmin = user?.userRoles.includes("admin");
  const isOwner = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.owner === true
  );
  const canEdit = isAdmin || isOwner


  // Helper function to get status badge color
  const getStatusBadgeColor = (status: Course["status"]) => {
    switch (status) {
      case 0:
        return "bg-blue-500"
      case 1:
        return "bg-yellow-500"
      case 2:
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="border-b">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/courses">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Courses
            </Link>
          </Button>

          {canEdit ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">

                <Link href={`/courses/${course.code}/edit`} >
                  <DropdownMenuItem className="cursor-pointer">
                    Edit Course
                  </DropdownMenuItem>
                </Link>

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div />
          )}


        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <Badge variant="outline">{course.code}</Badge>
              <Badge className={`${getStatusBadgeColor(course.status)} text-white`}>
                {course.status === 0
                  ? "In Progress"
                  : course.status === 1
                    ? "Upcoming"
                    : "Completed"}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {course.category} • {course.credits} credits
            </p>
          </div>

          {course.status === 1 && (
            <div className="mt-2 w-full md:mt-0 md:w-64">
              {/* <div className="mb-1 flex items-center justify-between text-sm">
                <span>Course Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
