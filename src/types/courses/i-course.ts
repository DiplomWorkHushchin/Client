import { CourseShcedule } from "./i-course-schedule"
import { Instructor } from "./i-instructor"

export interface Course {
  id: number
  title: string
  description: string
  coverBanner: string | null
  code: string
  category: string
  credits: number
  startDate: string
  endDate: string
  courseSchedule: CourseShcedule[]
  instructors: Instructor[]
  enrolledStudents: number
  status: number
}