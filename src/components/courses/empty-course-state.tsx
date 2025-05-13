"use client"

import { BookOpenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EmptyCourseStateProps {
  onResetFilters: () => void
}

export function EmptyCourseState({ onResetFilters }: EmptyCourseStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-6">
        <BookOpenIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">No courses found</h3>
      <p className="mb-4 text-muted-foreground">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
      <Button onClick={onResetFilters}>Reset Filters</Button>
    </div>
  )
}
