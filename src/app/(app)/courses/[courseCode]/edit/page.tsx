"use client"

import { use, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseBasicInfoForm } from "@/components/courses/create/course-basic-info-form"
import { CourseScheduleForm } from "@/components/courses/create/course-schedule-form"
import { CourseInstructorsForm } from "@/components/courses/create/course-instructors-form"
import { CoursePreview } from "@/components/courses/create/course-preview"
import { courseFormSchema } from "@/components/courses/create/course-schema"
import { CreateCourseDTO } from "@/DTOs/create-course-dto"
import { createCourseAsync, getCourseByCode, updateCourseAsync } from "@/services/courses-service"
import { Course } from "@/types/courses/i-course"

export type CourseStatus = z.infer<typeof courseFormSchema>["status"];

const courseStatusMap: Record<number, CourseStatus> = {
    0: "in-progress",
    1: "upcoming",
    2: "completed",
}

const statusOptions = [
    { label: "Upcoming", value: "upcoming" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
]

export default function CreateCoursePage({ params }: { params: Promise<{ courseCode: string }> }) {
    const router = useRouter()
    const unwrappedParams = use(params);
    const [activeTab, setActiveTab] = useState("basic-info")
    const [course, setCourse] = useState<Course | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)

    // Initialize form with default values
    const form = useForm<z.infer<typeof courseFormSchema>>({
        resolver: zodResolver(courseFormSchema),
    })

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCourses = async () => {
            const coursesData: Course | null = await getCourseByCode(unwrappedParams.courseCode);
            if (coursesData) setCourse(coursesData);
            setIsLoading(false);
            setPreviewUrl(`${process.env.NEXT_PUBLIC_BASE_API_URL}${coursesData?.coverBanner}` || null);
        };

        fetchCourses();
    }, [])

    useEffect(() => {
        if (course) {
            form.reset({
                title: course.title,
                description: course.description,
                category: course.category,
                credits: course.credits,
                status: courseStatusMap[course.status] ?? "upcoming",
                startDate: course.startDate,
                endDate: course.endDate,
                schedule: course.courseSchedule,
                instructors: course.instructors.map(instructor => ({
                    ...instructor,
                    canCreateAssignments: instructor.canCreateAssignments ?? false,
                    canModifyAssignments: instructor.canModifyAssignments ?? false,
                    canGradeStudents: instructor.canGradeStudents ?? false,
                    canManageUsers: instructor.canManageUsers ?? false,
                    
                    owner: instructor.owner ?? false,
                    firstName: instructor.firstName ?? "",
                    lastName: instructor.lastName ?? "",
                    email: instructor.email ?? "",
                    userName: instructor.userName ?? "",
                    fatherName: instructor.fatherName ?? "",
                    photoUrl: instructor.photoUrl ?? undefined,
                })),
            });
        }

        console.log("Form values: ", form.getValues());
    }, [course, form]);

    // Watch form values for preview
    const formValues = form.watch()

    // Handle form submission
    async function onSubmit(values: z.infer<typeof courseFormSchema>) {
        setIsSubmitting(true)

        const createCourseData: CreateCourseDTO = {
            ...values,
            coverImage: selectedFile,
        }

        // Check if course is null
        if (course) 
            await updateCourseAsync(course.code, createCourseData, router)
            
        console.log("Creating course with data: ", createCourseData)

        setIsSubmitting(false)
    }

    // Navigate to next tab
    const goToNextTab = () => {
        if (activeTab === "basic-info") setActiveTab("schedule")
        else if (activeTab === "schedule") setActiveTab("preview")
    }

    // Navigate to previous tab
    const goToPreviousTab = () => {
        if (activeTab === "preview")  setActiveTab("schedule")
        else if (activeTab === "schedule") setActiveTab("basic-info")
    }

    return (

        <div className="flex flex-1 flex-col">
            {!course && (
                <div className="flex flex-1 items-center justify-center">
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </div>
            )}
            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Edit course: {course?.title}</h1>
                        <Button variant="outline" onClick={() => router.push("/courses")}>
                            Cancel
                        </Button>
                    </div>

                    <Form {...form}>
                        <div className="space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="">
                                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic-info" className="mt-6">
                                    <CourseBasicInfoForm
                                        form={form}
                                        setPreviewUrl={setPreviewUrl}
                                        setSelectedFile={setSelectedFile}
                                        selectedFile={selectedFile}
                                        previewUrl={previewUrl}
                                    />
                                </TabsContent>

                                <TabsContent value="schedule" className="mt-6">
                                    <CourseScheduleForm form={form} />
                                </TabsContent>

                                <TabsContent value="instructors" className="mt-6">
                                    <CourseInstructorsForm form={form} />
                                </TabsContent>

                                <TabsContent value="preview" className="mt-6">
                                    <CoursePreview course={formValues} previewUrl={previewUrl} />
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={goToPreviousTab}
                                    disabled={activeTab === "basic-info"}
                                >
                                    Previous
                                </Button>

                                {activeTab !== "preview" ? (
                                    <Button type="button" onClick={() => {
                                        form.trigger().then(valid => {

                                            if (valid) goToNextTab()
                                            else {
                                                toast.error("Please fill in all required fields.")
                                            }
                                        })
                                    }}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                                        {isSubmitting ? "Editing..." : "Edit Course"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
