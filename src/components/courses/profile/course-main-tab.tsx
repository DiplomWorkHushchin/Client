"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpenIcon, CalendarIcon, ClockIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Course } from "@/types/courses/i-course"
import { getTasksAsync } from "@/services/materials-service"
import Task from "@/types/courses/i-task"
import { format } from "date-fns"
import Link from "next/link"

interface CourseMainTabProps {
  course: Course
}

export function CourseMainTab({ course }: CourseMainTabProps) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
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

  const getStartAndEndOfWeek = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);

    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);

    end.setDate(date.getDate() + (6 - date.getDay()));
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const { start, end } = getStartAndEndOfWeek(new Date());

  const upcomingTasks = tasks
    ?.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= start && taskDate <= end;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5) || [];

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
          {upcomingTasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks due this week</p>
          ) : (
            upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  {getTaskIcon(task.materialType)}
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground">Due: {format(task.dueDate, "dd.MM.yyyy")}</div>
                  </div>
                </div>
                <Link href={`/courses/${course.code}/tasks/${task.id}`}>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    View
                  </Button>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
