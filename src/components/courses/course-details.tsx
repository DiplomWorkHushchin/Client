"use client"

import { ClockIcon, User, UserCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getStatusBadgeColor } from "./course-card"
import { Course } from "@/types/courses/i-course"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface CourseDetailsProps {
  course: Course
  onClose: () => void
  isMobile: boolean
}

export function CourseDetails({ course, onClose, isMobile }: CourseDetailsProps) {
  return (
    <div className={`border-l ${isMobile ? "w-full" : "w-96 lg:w-[450px]"}`}>
      <ScrollArea className="h-full">
        <div className="flex flex-col">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {course.coverBanner ?
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${course.coverBanner}` || "/placeholder.svg"}
                alt={course.title}
                className="h-full w-full object-cover"
              /> : <div className="h-full w-full bg-muted" />}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-2 rounded-full bg-background/80 hover:bg-background/90"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only">Back</span>
            </Button>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <Badge className={`${getStatusBadgeColor(course.status)} text-white`}>
                {course.status === 0
                  ? "In Progress"
                  : course.status === 1                    ? "Upcoming"
                    : "Completed"}
              </Badge>
            </div>

            <h2 className="mb-2 text-2xl font-bold">{course.title}</h2>
            <p className="mb-6 text-muted-foreground">{course.description}</p>

            {course.status === 1 && (
              <div className="mb-6">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Progress</span>
                  {/* <span>{course.progress}%</span> */}
                </div>
                {/* <Progress value={course.progress} className="h-2" /> */}
              </div>
            )}

            <div className="grid gap-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">Instructors</h3>
                <div className="flex flex-col gap-3">
                  {course.instructors.map((instructor, index) => (
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger asChild className="cursor-pointer hover:bg-secondary/80 rounded-md p-2">
                        <div className="flex gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                            {instructor.photoUrl ?
                              <img
                                src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${instructor.photoUrl}` || "/placeholder.svg"}
                                alt={instructor.firstName + " " + instructor.lastName}
                                className="h-full w-full object-cover"
                              /> : <div className="h-full w-full bg-muted flex justify-center items-center"><User /></div>}
                          </div>
                          <div>
                            <div className="font-medium">
                              {instructor.firstName} {instructor.lastName} {instructor.fatherName}
                            </div>
                            <div className="text-sm text-muted-foreground">{instructor.email}</div>
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Link href={`/profile/${instructor?.userName}`} className="hover:bg-secondary/80 rounded-md flex items-center gap-2 w-full h-full p-1">
                          <UserCircleIcon className="text-muted-foreground w-4 h-4"/>
                          Profile
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">Schedule</h3>
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

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">Course Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Course Credits</div>
                    <div className="font-medium">{course.credits}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">
                      {new Date(course.startDate).toLocaleDateString()} -{" "}
                      {new Date(course.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="mt-4 flex gap-2">
                <Link href={`/courses/${course.code}`} className="flex flex-1">
                  <Button className="flex-1">Go to Course</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
