"use client"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { type UseFormReturn, useFieldArray } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseFormValues } from "./course-schema"

interface CourseScheduleFormProps {
  form: UseFormReturn<CourseFormValues>
}

export function CourseScheduleForm({ form }: CourseScheduleFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedule",
  })

  const addScheduleItem = () => {
    append({
      day: "",
      time: "",
      location: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Schedule</CardTitle>
        <CardDescription>
          Define when and where the course will take place. Add as many sessions as needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No schedule items yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add days, times, and locations for your course sessions.
            </p>
            <Button onClick={addScheduleItem}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Schedule Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Session {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.day`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`schedule.${index}.time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10:00 - 11:30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`schedule.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Room 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" onClick={addScheduleItem}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Another Session
        </Button>
      </CardFooter>
    </Card>
  )
}
