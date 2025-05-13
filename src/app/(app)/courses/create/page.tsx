"use client"

import { useState } from "react"
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
import { createCourseAsync } from "@/services/courses-service"

export default function CreateCoursePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic-info")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      credits: 3.5,
      status: "upcoming",
      startDate: "",
      endDate: "",
      instructors: [],
      schedule: [],
    },
  })

  // Watch form values for preview
  const formValues = form.watch()

  // Handle form submission
  async function onSubmit(values: z.infer<typeof courseFormSchema>) {
    setIsSubmitting(true)

    const createCourseData: CreateCourseDTO = {
      ...values,
      coverImage: selectedFile,
    }

    await createCourseAsync(createCourseData, router)
    
    setIsSubmitting(false)
  }

  // Navigate to next tab
  const goToNextTab = () => {
    if (activeTab === "basic-info") setActiveTab("schedule")
    else if (activeTab === "schedule") setActiveTab("instructors")
    else if (activeTab === "instructors") setActiveTab("preview")
  }

  // Navigate to previous tab
  const goToPreviousTab = () => {
    if (activeTab === "preview") setActiveTab("instructors")
    else if (activeTab === "instructors") setActiveTab("schedule")
    else if (activeTab === "schedule") setActiveTab("basic-info")
  } 

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Create New Course</h1>
            <Button variant="outline" onClick={() => router.push("/courses")}>
              Cancel
            </Button>
          </div>

          <Form {...form}>
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="instructors">Instructors</TabsTrigger>
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
                  <Button disabled={isSubmitting}  onClick={form.handleSubmit(onSubmit)}>
                    {isSubmitting ? "Creating..." : "Create Course"}
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
