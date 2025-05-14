import { z } from "zod"

// Schema for schedule items
export const scheduleItemSchema = z.object({
  day: z.string().min(1, "Day is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
})

// Schema for instructors
export const instructorSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  fatherName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  userName: z.string().min(1, "User name is required"),
  photoUrl: z.string().optional(),
  canCreateAssignments: z.boolean(),
  canModifyAssignments: z.boolean(),
  canGradeStudents: z.boolean(),
  canManageUsers: z.boolean(),
  owner: z.boolean().optional(),
})

// Main course form schema
export const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  credits: z.number().min(0.5, "Credits must be at least 1"),
  status: z.enum(["in-progress", "upcoming", "completed"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  instructors: z.array(instructorSchema),
  schedule: z.array(scheduleItemSchema),
  coverImage: z.any().refine((file) => file instanceof File || typeof file === "string", ).optional(),
})

// Type for the course form data
export type CourseFormValues = z.infer<typeof courseFormSchema>
