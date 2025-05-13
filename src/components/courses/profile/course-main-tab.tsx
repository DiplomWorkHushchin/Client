"use client"

import { useState } from "react"
import { BellIcon, BookOpenIcon, CalendarIcon, ClockIcon, InfoIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Course } from "@/types/courses/i-course"

interface CourseMainTabProps {
  course: Course
}

export function CourseMainTab({ course }: CourseMainTabProps) {

  const upcomingDeadlines = [
    {
      id: "1",
      title: "Assignment #3",
      dueDate: "May 15, 2025",
      type: "assignment",
    },
    {
      id: "2",
      title: "Quiz on Chapter 5",
      dueDate: "May 18, 2025",
      type: "quiz",
    },
    {
      id: "3",
      title: "Group Project Milestone",
      dueDate: "May 22, 2025",
      type: "project",
    },
  ]

  // Calculate module progress
  const modules = [
    { id: "1", title: "Introduction to the Course", progress: 100 },
    { id: "2", title: "Fundamental Concepts", progress: 75 },
    { id: "3", title: "Advanced Topics", progress: 30 },
    { id: "4", title: "Practical Applications", progress: 0 },
    { id: "5", title: "Final Project", progress: 0 },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Course Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
          <CardDescription>Key information about this course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-lg font-medium">Description</h3>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Schedule</h3>
            <div className="grid gap-2">
              {course.courseSchedule.map((item, index) => (
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

          <div>
            <h3 className="mb-2 text-lg font-medium">Instructors</h3>
            <div className="flex flex-col gap-3">
              {course.instructors.map((instructor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${instructor.photoUrl}` || ""} alt={instructor.userName} />
                    <AvatarFallback>{instructor.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{instructor.firstName} {instructor.lastName} {instructor.fatherName}</div>
                    <div className="text-sm text-muted-foreground">{instructor.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </div>
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingDeadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                {deadline.type === "assignment" && <BookOpenIcon className="h-4 w-4 text-blue-500" />}
                {deadline.type === "quiz" && <InfoIcon className="h-4 w-4 text-yellow-500" />}
                {deadline.type === "project" && <BookOpenIcon className="h-4 w-4 text-green-500" />}
                <div>
                  <div className="font-medium">{deadline.title}</div>
                  <div className="text-xs text-muted-foreground">Due: {deadline.dueDate}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            View All Deadlines
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
