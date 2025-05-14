"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  UserPlus,
  Filter,
  MoreHorizontal,
  UserCog,
  SortAsc,
  SortDesc,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import IUser from "@/types/i-user"
import { getUserByPages, registerUserAsync } from "@/services/user-service"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Link from "next/link"
import { RegisterDTO } from "@/DTOs/register-dto"

// Form schema for user registration
const userFormSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    fatherName: z.string().optional(),
    email: z.string().email({ message: "Please enter a valid email address." }),
    role: z.enum(["Teacher", "Student"], {
      required_error: "Please select a role.",
    }),
    department: z.string().optional(),
    status: z.enum(["active", "inactive", "pending"], {
      required_error: "Please select a status.",
    })
  })

export default function UsersPage() {
  const user: IUser | null = useSelector((state: RootState) => state.user.user);
  const [users, setUsers] = useState<IUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<"name" | "role">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")



  const usersPerPage = 10

  // Form for user registration
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      fatherName: "",
      email: "",
      role: "Student",
      department: "",
      status: "active",
    },
  })

  const hasFetched = useRef(false);

  const fetchUsers = async () => {
    setIsLoading(true)

    const users = await getUserByPages(currentPage, usersPerPage);
    if (users) {
      setUsers(users)
      console.log(users)
      setIsLoading(false)
    } else {
      setUsers([])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch courses data from the API or any other source
    if (hasFetched.current) return;
    hasFetched.current = true;



    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.lastName} ${user.firstName} ${user.fatherName || ""}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.group.toLowerCase().includes(searchQuery.toLowerCase())

    const role = user.userRoles[0] || "Student"

    const matchesRole = roleFilter === "all" || role === roleFilter

    return matchesSearch && matchesRole
  })

  // Сортировка
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const nameA = `${a.lastName} ${a.firstName}`
    const nameB = `${b.lastName} ${b.firstName}`

    if (sortField === "name") {
      return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    }

    if (sortField === "role") {
      const roleA = a.userRoles[0] || ""
      const roleB = b.userRoles[0] || ""
      return sortDirection === "asc" ? roleA.localeCompare(roleB) : roleB.localeCompare(roleA)
    }

    return 0
  })

  // Пагинация
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // Toggle sort direction
  const toggleSort = (field: "name" | "role") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get role badge
  const getRoleBadges = (roles: IUser["userRoles"]) => {
    return roles.map((role) => {
      switch (role) {
        case "Admin":
          return <Badge key={role} className="bg-red-500">Admin</Badge>
        case "Teacher":
          return <Badge key={role} className="bg-blue-500">Teacher</Badge>
        case "Student":
          return <Badge key={role} className="bg-green-500">Student</Badge>
        default:
          return null
      }
    })
  }

  async function onSubmit(data: z.infer<typeof userFormSchema>) {
    // Handle form submission
    console.log("Form submitted:", data)

    const username = data.email.split("@")[0] + Math.floor(Math.random() * 1000) + "_" + data.firstName[0] + data.lastName[0]

    const registerDto: RegisterDTO = {
      username: username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fatherName: data.fatherName || "",
      groupName: data.department || "",
      role: data.role,
    }

    await registerUserAsync(registerDto);
    await fetchUsers();

    setIsRegisterDialogOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="p-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-2xl">Users</CardTitle>
                <CardDescription>Manage system users and their permissions</CardDescription>
              </div>

              {user?.userRoles.includes("Admin") && (<Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Register New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account in the system. Fill in the required information below.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Volodymyr" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Hushchin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Sergiyovich" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Teacher">Teacher</SelectItem>
                                  <SelectItem value="Student">Student</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                      </div>

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Registering..." : "Register User"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>)}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or department..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1) // Reset to first page on search
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={roleFilter}
                    onValueChange={(value) => {
                      setRoleFilter(value)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => toggleSort("name")}>
                        {sortField === "name" && sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4 mr-1" />
                        ) : sortField === "name" && sortDirection === "desc" ? (
                          <SortDesc className="h-4 w-4 mr-1" />
                        ) : null}
                        Sort by Name
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleSort("role")}>
                        {sortField === "role" && sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4 mr-1" />
                        ) : sortField === "role" && sortDirection === "desc" ? (
                          <SortDesc className="h-4 w-4 mr-1" />
                        ) : null}
                        Sort by Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading state
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                              <div className="space-y-2">
                                <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                                <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="h-8 w-8 bg-muted animate-pulse rounded-full ml-auto"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.userName}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${user.photoUrl}` || ""} alt={user.userName} />
                                <AvatarFallback>{user.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.firstName} {user.lastName} {user.fatherName}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadges(user.userRoles)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/profile/${user.userName}`}>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <UserCog className="h-4 w-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                    {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
