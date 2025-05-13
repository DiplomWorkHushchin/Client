"use client"

import { useEffect, useRef, useState } from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { CourseDetails } from "@/components/courses/course-details"
import { CourseList } from "@/components/courses/course-list"
import { CourseFilters } from "@/components/courses/course-filters"
import { Course } from "@/types/courses/i-course"
import { getAllCoursesAsync } from "@/services/courses-service"
import { Separator } from "@/components/ui/separator"


export default function CoursesListPage() {
    const isMobile = useIsMobile()
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("title")
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [activeTab, setActiveTab] = useState("all")
    const [courses, setCourses] = useState<Course[]>([])

    const hasFetched = useRef(false);

    useEffect(() => {
        // Fetch courses data from the API or any other source
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCourses = async () => {
            const coursesData = await getAllCoursesAsync();
            if (coursesData) setCourses(coursesData);
            console.log(coursesData);
        };

        fetchCourses();

    }, [])

    const filterByStatus = (course: Course) => {
        if (statusFilter === "all") return true;

        const statusMap: { [key: string]: number } = {
            "in-progress": 1,
            "upcoming": 2,
            "completed": 3,
        };

        const statusValue = statusMap[statusFilter];

        return course.status === statusValue;
    };

    const filterByCategory = (course: Course) => {
        return categoryFilter === "all" || course.category === categoryFilter;
    };

    const filteredCourses = courses
        .filter((course) => {
            const matchesSearch =
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());

            const statusMatches = filterByStatus(course);
            const categoryMatches = filterByCategory(course);

            if (activeTab === "all") return matchesSearch && statusMatches && categoryMatches;
            if (activeTab === "in-progress") return matchesSearch && course.status === 0 && categoryMatches;
            if (activeTab === "upcoming") return matchesSearch && course.status === 1 && categoryMatches;
            if (activeTab === "completed") return matchesSearch && course.status === 2 && categoryMatches;

            return matchesSearch && categoryMatches;
        })

    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setCategoryFilter("all");
        setActiveTab("all");
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col">
                {/* Courses header with filters */}
                <div className="p-4">
                    <CourseFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>


                <Separator />
                {/* Courses content */}
                <div className="flex flex-1 overflow-hidden">
                    <div className={`flex-1 p-4 ${isMobile && selectedCourse ? "hidden" : "block"}`}>
                        <CourseList
                            courses={filteredCourses}
                            onSelectCourse={setSelectedCourse}
                            onResetFilters={resetFilters}
                            selectedCourse={selectedCourse}
                        />
                    </div>

                    {/* Course details */}
                    {selectedCourse && (
                        <CourseDetails course={selectedCourse} onClose={() => setSelectedCourse(null)} isMobile={isMobile} />
                    )}
                </div>
            </div>
        </div>
    )
}
