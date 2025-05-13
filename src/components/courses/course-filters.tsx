"use client"

import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import IUser from "@/types/i-user"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface CourseFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function CourseFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  activeTab,
  setActiveTab,
}: CourseFiltersProps) {
  const user: IUser | null = useSelector((state: RootState) => state.user.user);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
            <SelectItem value="History">History</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Economics">Economics</SelectItem>
            <SelectItem value="Psychology">Psychology</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        

        <div className="flex flex-wrap items-center gap-2">
          {!user?.userRoles.includes("Student") ?
            <Link href="/courses/create">
              <Button className="ml-auto md:ml-0">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
            : <div/>}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
