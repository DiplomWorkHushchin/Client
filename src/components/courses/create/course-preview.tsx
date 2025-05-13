"use client"

import { ClockIcon, UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { CourseFormValues } from "./course-schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CoursePreviewProps {
  course: CourseFormValues
  previewUrl: string | null
}

export function CoursePreview({ course, previewUrl }: CoursePreviewProps) {
  // Helper function to get status badge color
  const getStatusBadgeColor = (status: CourseFormValues["status"]) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-500"
      case "upcoming":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Preview</CardTitle>
        <CardDescription>
          This is how your course will appear to students. Review all details before submitting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-hidden rounded-lg border">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            {previewUrl ?
              <img
                src={previewUrl || "/placeholder.svg?height=200&width=400&text=Course"}
                alt={course.title}
                className="h-full w-full object-cover"
              /> : <div className="h-full w-full bg-muted flex items-center justify-center" />}
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-muted-foreground">{course.category}</h1>
              </div>
              <Badge className={`${getStatusBadgeColor(course.status)} text-white`}>
                {course.status === "in-progress"
                  ? "In Progress"
                  : course.status === "upcoming"
                    ? "Upcoming"
                    : "Completed"}
              </Badge>
            </div>

            <h2 className="mb-2 text-2xl font-bold">{course.title || "Course Title"}</h2>
            <p className="mb-6 text-muted-foreground">{course.description || "Course description will appear here."}</p>

            {course.status === "in-progress" && (
              <div className="mb-6">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            )}

            <div className="grid gap-6">

              {course.schedule.length > 0 && (
                <>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Schedule</h3>
                    <div className="grid gap-2">
                      {course.schedule.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <ClockIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{item.day}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.time} • {item.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              <div>
                <h3 className="mb-3 text-lg font-semibold">Course Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Credits</div>
                    <div className="font-medium">{course.credits}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">
                      {course.startDate ? new Date(course.startDate).toLocaleDateString() : "Start date"} -{" "}
                      {course.endDate ? new Date(course.endDate).toLocaleDateString() : "End date"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
