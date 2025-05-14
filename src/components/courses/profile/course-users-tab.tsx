"use client"

import { useEffect, useRef, useState } from "react"
import { PlusCircle, PlusCircleIcon, SearchIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Course } from "@/types/courses/i-course"
import IUser from "@/types/i-user"
import { addNewUserToCourseAsync, getAllCourseInstructorsAsync, getAllCourseStudentsAsync } from "@/services/courses-service"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { findUserLiveAsync } from "@/services/user-service"

interface CourseUsersTabProps {
  course: Course
}

export function CourseUsersTab({ course }: CourseUsersTabProps) {
  const user: IUser | null = useSelector((state: RootState) => state.user.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [instructors, setInstructors] = useState<IUser[]>([]);
  const [students, setStudents] = useState<IUser[]>([]);
  const [searchAddUserQuery, setSearchAddUserQuery] = useState("")
  const [searchAddUsers, setSearchAddUsers] = useState<IUser[]>([])
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const users: IUser[] = [...instructors, ...students];

  const isAdmin = user?.userRoles.includes("admin");
  const isOwner = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.owner === true
  );
  const isCanManageUsers = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.canManageUsers === true
  )

  const canManageUsers = isAdmin || isOwner || isCanManageUsers

  const isCanGradeStudents = course.instructors.some(
    (instructor) => instructor.email === user?.email && instructor.canGradeStudents === true
  )
  const canGrade = isAdmin || isOwner || isCanGradeStudents

  const hasFetched = useRef(false);

  const fetchIsntructrs = async () => {
    const instructorsData: IUser[] | null = await getAllCourseInstructorsAsync(course.code);
    if (instructorsData) setInstructors(instructorsData);
  };

  const fetchStudents = async () => {
    const studentData: IUser[] | null = await getAllCourseStudentsAsync(course.code);
    if (studentData) setStudents(studentData);
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchIsntructrs();
    fetchStudents();
  }, []);

  const handleSearchChange = (query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(async () => {
      if (query.length > 2) {
        console.log("searching for users with query: ", query)
        const users = await findUserLiveAsync(query)
        setSearchAddUsers(users)
      } else {
        setSearchAddUsers([])
      }
    }, 500)

    setTimeoutId(newTimeoutId)
  }

  const handleAddUser = async (email: string) => {
    await addNewUserToCourseAsync(course.code, email)

    fetchIsntructrs();
    fetchStudents();
  }

  const filteredUsers = users.filter((user) => {
    const fullName = (user.firstName + " " + user.lastName + " " + user.fatherName).toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      user.userRoles.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
    }
    if (sortBy === "role") {
      const aRole = a.userRoles.join(", ");
      const bRole = b.userRoles.join(", ");
      return aRole.localeCompare(bRole);
    }
    return 0;
  });

  const studentCount = users.filter((user) => user.userRoles.includes("Student")).length;
  const instructorCount = users.filter((user) => user.userRoles.includes("Teacher")).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Users</CardTitle>
              <CardDescription>View and manage users enrolled in this course</CardDescription>
            </div>
            {canManageUsers && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add user
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add new user</DialogTitle>
                    <DialogDescription>
                      Type here user Name and press add.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="">
                    <div className="">
                      <Input
                        value={searchAddUserQuery}
                        onChange={(e) => {
                          setSearchAddUserQuery(e.target.value)
                          handleSearchChange(e.target.value)
                        }}
                        placeholder="Search for instructors..."
                        autoFocus={true}
                      />

                      {searchAddUsers && searchAddUsers.length > 0 ? (
                        <div className="space-y-4 mt-4">
                          {searchAddUsers.map((user: IUser) => (
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
                                onClick={() => handleAddUser(user.email)}
                                className="w-full md:w-auto"
                              >
                                <PlusCircleIcon />
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button >Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Student">Students</SelectItem>
                  <SelectItem value="Teacher">Instructors</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="role">Sort by Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={roleFilter} onValueChange={setRoleFilter}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All <Badge className="ml-2 bg-primary/20 text-xs">{users.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Student">
                Students <Badge className="ml-2 bg-primary/20 text-xs">{studentCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Teacher">
                Instructors <Badge className="ml-2 bg-primary/20 text-xs">{instructorCount}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {sortedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No users found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            ) : (
              sortedUsers.map((user) => (
                <div key={user.userName} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.photoUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${user.photoUrl}` : ""}
                        alt={user.userName}
                      />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName} {user.fatherName}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant={user.userRoles.includes("Teacher") ? "default" : "outline"}>
                      {user.userRoles.includes("Teacher") ? "Instructor" : "Student"}
                    </Badge>

                    <Button variant="ghost" size="sm">
                      View
                    </Button>

                    {(canGrade && user.userRoles.includes("Student")) && (
                      <Button size="sm">
                        Grade
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
