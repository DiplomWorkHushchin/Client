"use client"

import { CalendarIcon, Image, User } from "lucide-react"
import { format } from "date-fns"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CourseFormValues } from "./course-schema"
import SelectCourseImgBlock from "./course-load-picture"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface CourseBasicInfoFormProps {
  form: UseFormReturn<CourseFormValues>
  selectedFile: File | null
  previewUrl: string | null
  setSelectedFile: (file: File | null) => void
  setPreviewUrl: (url: string | null) => void
}

export function CourseBasicInfoForm({ form, selectedFile, previewUrl, setSelectedFile, setPreviewUrl }: CourseBasicInfoFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageSelect = async (file: File) => {
    console.log("Selected file:", file);
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setIsDialogOpen(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Course Information</CardTitle>
        <CardDescription>
          Enter the basic details about your course. This information will be displayed to students.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Introduction to Computer Science" {...field} />
                </FormControl>
                <FormDescription>The full title of your course</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the course..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>Explain what students will learn in this course</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-start gap-6">
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col h-fit">
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormDescription>The subject area of the course</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Current status of the course</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} step={0.5} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormDescription>Number of credits for this course</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>When the course begins</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>When the course ends</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Course Cover Image</FormLabel>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                      {previewUrl ?
                        <img
                          src={previewUrl}
                          alt="banner-img"
                          className="rounded-md w-full h-full object-cover cursor-pointer"
                        />
                        :
                        <div
                          className="bg-secondary rounded-md w-full max-w-2xl aspect-video flex justify-center items-center cursor-pointer"
                          onClick={() => setIsDialogOpen(!isDialogOpen)}
                        >
                          <Image className="h-12 w-12" />
                        </div>
                      }
                  </DialogTrigger>
                  <DialogContent className="аspect-[16/9]">
                    <DialogHeader>
                      <DialogTitle>Edit course banner</DialogTitle>
                      <DialogDescription>Select new course banner picture. Click on image or drag-drop to dashed area.</DialogDescription>
                    </DialogHeader>

                    <SelectCourseImgBlock
                      onImageSelect={setSelectedFile}
                      selectedFile={selectedFile}
                    />

                    <DialogFooter>
                      <Button variant={"secondary"} onClick={() => setSelectedFile(null)}>Reset</Button>
                      <Button onClick={() => {
                        if (selectedFile) handleImageSelect(selectedFile);
                      }}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <FormDescription>This image will be used as the course thumbnail (16:9 ratio)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
      </CardContent>
    </Card>
  )
}
