"use client"

import { PlusCircleIcon, Trash2Icon, UserIcon } from "lucide-react"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import IUser from "@/types/i-user"
import { findUserLiveAsync } from "@/services/user-service"
import { CourseFormValues } from "./course-schema"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormField, FormItem } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface CourseInstructorsFormProps {
  form: UseFormReturn<CourseFormValues>
}

export function CourseInstructorsForm({ form }: CourseInstructorsFormProps) {
  const userState: IUser | null = useSelector((state: RootState) => state.user.user);
  const [users, setUsers] = useState<IUser[] | null>(null)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructors",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleSearchChange = (query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(async () => {
      if (query.length > 2) {
        const users = await findUserLiveAsync(query)
        setUsers(users)
      } else {
        setUsers(null)
      }
    }, 500)

    setTimeoutId(newTimeoutId)
  }

  const addInstructor = (user: IUser) => {
    if (user.userName === userState?.userName) {
      toast.error("You cannot add yourself as an instructor")
      return
    }

    const alreadyExists = fields.some((instructor) => instructor.userName === user.userName)
    if (alreadyExists) {
      toast.error("Instructor already added")
      return
    }

    append({
      firstName: user.firstName,
      lastName: user.lastName,
      fatherName: user.fatherName,
      userName: user.userName,
      photoUrl: user.photoUrl ?? undefined,
      email: user.email,
      canCreateAssignments: false,
      canModifyAssignments: false,
      canGradeStudents: false,
      canManageUsers: false,
    })

    console.log("Permissions:", {
      canCreateAssignments: false,
      canModifyAssignments: false,
      canGradeStudents: false,
      canManageUsers: false,
    })

    setSearchQuery("")
    setUsers(null)
  }



  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Instructors</CardTitle>
        <CardDescription>Add information about the instructors who will be teaching this course.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            handleSearchChange(e.target.value)
          }}
          placeholder="Search for instructors..."
          autoFocus={true}
        />

        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users
              .map((user: IUser) => (
                <div key={user.userName} className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${user.photoUrl}` || "/placeholder.svg"} alt={user.userName} />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">{user.firstName} {user.lastName} {user?.fatherName}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => addInstructor(user)}
                    className="w-full md:w-auto"
                  >
                    <PlusCircleIcon />
                    Add
                  </Button>
                </div>
              ))}
          </div>
        ) : null}


        {!users && searchQuery.length > 0 && (
          <p className="w-full text-center text-md">No users found</p>
        )}

        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-3 text-center">
          {fields.length > 0 ? (
            <div className="space-y-4 w-full">
              {fields
              .filter((u) => u.userName !== userState?.userName)
              .map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4">
                  <div className=" flex flex-col items-start md:flex-row gap-3 md:items-center justify-between w-full ">
                    <div className="flex items-center md:w-[300px] gap-2">
                      <Avatar>
                        <AvatarImage src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${field.photoUrl}` || "/placeholder.svg"} alt={field.userName || "Instructor"} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <h4 className="text-sm font-medium text-start">{field.firstName} {field.lastName} {field?.fatherName}</h4>
                        <p className="text-xs md:text-sm text-muted-foreground text-start">{field.email}</p>
                      </div>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">Permissions</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name={`instructors.${index}.canCreateAssignments`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                />
                                <label htmlFor="canCreateAssignments" className="text-sm font-medium">
                                  Can Create Assignments {field.value.toString()}
                                </label>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`instructors.${index}.canModifyAssignments`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                />
                                <label htmlFor="canModifyAssignments" className="text-sm font-medium">
                                  Can Modify Assignments {field.value.toString()}
                                </label>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`instructors.${index}.canGradeStudents`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                />
                                <label htmlFor="canGradeStudents" className="text-sm font-medium">
                                  Can Grade Students {field.value.toString()}
                                </label>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`instructors.${index}.canManageUsers`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                />
                                <label htmlFor="canManageUsers" className="text-sm font-medium">
                                  Can Manage Users {field.value.toString()}
                                </label>
                              </FormItem>
                            )}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant={"destructive"}
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-full flex items-center justify-center gap-2 md:hidden"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="">Remove</span>
                    </Button>
                    <Button
                      variant={"ghost"}
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8  text-destructive hidden md:flex items-center justify-center gap-2"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12">
              <h3 className="mb-2 text-lg font-medium">No instructors added yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">Search and add instructors to this course.</p>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  )
}
