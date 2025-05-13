"use client"

import { use, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CourseHeader } from "@/components/courses/profile/course-header"
import { CourseTabs } from "@/components/courses/profile/course-tabs"
import { CourseMainTab } from "@/components/courses/profile/course-main-tab"
import { CourseTasksTab } from "@/components/courses/profile/course-tasks-tab"
import { CourseUsersTab } from "@/components/courses/profile/course-users-tab"
import { getCourseByCode } from "@/services/courses-service"
import { Course } from "@/types/courses/i-course"


export default function CoursePage({ params }: { params: Promise<{ courseCode: string }> }) {
    const router = useRouter()
    const unwrappedParams = use(params);
    const [activeTab, setActiveTab] = useState("main")
    const [course, setCourse] = useState<Course | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCourses = async () => {
            const coursesData: Course | null = await getCourseByCode(unwrappedParams.courseCode);
            if (coursesData) setCourse(coursesData);
            console.log(coursesData);
            setIsLoading(false);
        };

        fetchCourses();
    }, [])

    if (!course && !isLoading) {
        router.push("/courses");
    }

    return (
        <div className="flex flex-1 flex-col">
            {course && <CourseHeader course={course} />}

            <div className="@container/main flex flex-1 flex-col">
                <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {course &&
                    <div className="flex-1 p-6">
                        {activeTab === "main" && <CourseMainTab course={course} />}
                        {activeTab === "tasks" && <CourseTasksTab course={course} />}
                        {activeTab === "users" && <CourseUsersTab course={course} />}
                    </div>
                }
            </div>
        </div>
    )
}
