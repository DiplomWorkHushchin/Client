"use client"

import { BookOpenIcon, ClockIcon, GraduationCapIcon, UsersIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Course } from "@/types/courses/i-course"


interface CourseCardProps {
  course: Course
  onClick: (course: Course) => void
}

// Helper function to get status badge color
export const getStatusBadgeColor = (status: Course["status"]) => {
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

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card className="pt-0 cursor-pointer overflow-hidden transition-all hover:shadow-md" onClick={() => onClick(course)}>
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {course.coverBanner ?
          <img src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${course.coverBanner}` || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover" />
          : <div className="h-full w-full bg-muted" />}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <Badge className={`${getStatusBadgeColor(course.status)} text-white`}>
            {course.status === 0 ? "In Progress" : course.status === 1 ? "Upcoming" : "Completed"}
          </Badge>
          <Badge className="bg-muted text-muted-foreground">
            {course.code}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCapIcon className="h-4 w-4" />
          <span>{course.category}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <UsersIcon className="h-4 w-4" />
          <span>{course.instructors.map((instructor) => instructor.firstName + " " + instructor.lastName).join(", ")}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-4 p-4 pt-0">
        {course.status === 0 && (
          <div className="w-full">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>100%</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
        )}
        {course.status === 1 && (
          <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>Starts on {new Date(course.startDate).toLocaleDateString()}</span>
          </div>
        )}
        {course.status === 2 && (
          <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
            <BookOpenIcon className="h-4 w-4" />
            <span>Completed on {new Date(course.endDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
