"use client"

import type { Course } from "@/types/courses/i-course"
import { CourseCard } from "./course-card"
import { EmptyCourseState } from "./empty-course-state"

interface CourseListProps {
  courses: Course[]
  onSelectCourse: (course: Course) => void
  onResetFilters: () => void
  selectedCourse: Course | null
}

export function CourseList({ courses, onSelectCourse, onResetFilters, selectedCourse }: CourseListProps) {
  if (courses.length === 0) {
    return <EmptyCourseState onResetFilters={onResetFilters} />
  }

  return (
    <div className={`grid gap-4  ${selectedCourse ? "smd:grid-cols-1 lmd:grid-cols-1 ld:grid-cols-2 xld:grid-cols-3" : "smd:grid-cols-2 lmd:grid-cols-3 lg:grid-cols-4"}`}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onClick={onSelectCourse} />
      ))}
    </div>
  )
}
