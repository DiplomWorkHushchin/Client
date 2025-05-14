"use client"

import { use, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ChevronLeft, Clock, FileText, Trash2, Upload, File, Loader2Icon } from "lucide-react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import CreateTaskDTO from "@/DTOs/create-task-dto"
import { createTaskAsync } from "@/services/materials-service"

// Form schema for task creation
const taskFormSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
    description: z.string(),
    type: z.enum(["lecture", "task"], {
        required_error: "Please select a task type.",
    }),
    points: z.coerce.number().min(0).max(100).optional(),
    dueDate: z.date({
        required_error: "A due date is required.",
    }),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

// Default values for the form
const defaultValues: Partial<TaskFormValues> = {
    title: "",
    description: "",
    type: "lecture",
    points: 10,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
}

// Function to format file size
function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function CreateTaskPage({ params }: { params: Promise<{ courseCode: string }> }) {
    const unwrappedParams = use(params)
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [materials, setMaterials] = useState<TaskFile[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDefault, setIsDefault] = useState(true);


    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues,
    })

    useEffect(() => {
        const subscription = form.watch((currentValues) => {
            const isEqual = JSON.stringify(currentValues) === JSON.stringify(defaultValues);
            setIsDefault(isEqual);
        });

        return () => subscription.unsubscribe();
    }, [form]);

    async function onSubmit(data: TaskFormValues) {
        setIsSubmitting(true)

        const createTaskDto: CreateTaskDTO = {
            title: data.title,
            description: data.description,
            type: data.type,
            dueDate: new Date(data.dueDate),
            maxPoints: data.type === "task" ? data.points : undefined,
            materials: materials.map((material) => ({
                name: material.name,
                file: material.file,
            })),
        }
        
        await createTaskAsync(unwrappedParams.courseCode, createTaskDto, router)

        setIsSubmitting(false)
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files || files.length === 0) return

        const allowedExtensions = ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'mp3']
        const newMaterials: TaskFile[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const ext = file.name.split('.').pop()?.toLowerCase()

            if (!ext || !allowedExtensions.includes(ext)) {
                toast.error(`File "${file.name}" have unaccepted format. Allowed only: PDF, DOCX, XLSX, PPTX.`)
                continue
            }

            newMaterials.push({
                id: crypto.randomUUID(),
                file: file,
                name: file.name,
                size: formatFileSize(file.size),
            })
        }

        setMaterials([...materials, ...newMaterials])

        // Reset the file input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    function removeMaterial(id: string) {
        setMaterials(materials.filter((material) => material.id !== id))
    }

    function updateMaterialName(id: string, name: string) {
        setMaterials(materials.map((material) => (material.id === id ? { ...material, name } : material)))
    }

    function triggerFileInput() {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }


    return (
        <div className="@container/main flex flex-1 flex-col p-6 gap-4">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-2xl font-bold">Create New Task</h1>
                </div>
            </div>

            {/* Task creation form */}
            <Form {...form}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Basic information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Enter the basic details for this task.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter task title" {...field} />
                                            </FormControl>
                                            <FormDescription>The title of the task as it will appear to students.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter task description" className="min-h-[120px]" {...field} />
                                            </FormControl>
                                            <FormDescription>Detailed instructions for completing the task.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Task Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="lecture">Lecture</SelectItem>
                                                        <SelectItem value="task">Task</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch("type") === "task" && (
                                        <FormField
                                            control={form.control}
                                            name="points"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Points</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min={0} max={100} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />)}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Due date and assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule & Assignment</CardTitle>
                                <CardDescription>Set the due date.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Due Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Materials (Files) */}
                    <Card className="col-span-1 md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <CardTitle>Task Materials</CardTitle>
                                <CardDescription>Attach files and resources for this task.</CardDescription>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                        </CardHeader>
                        <CardContent>
                            {materials.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium">No files attached</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Upload files for students to use when completing this task.
                                    </p>
                                    <div className="mt-4 flex flex-col items-center">
                                        <Button type="button" variant="secondary" size="sm" onClick={triggerFileInput}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Files
                                        </Button>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Supports documents, images, videos, and audio files
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {materials.map((material) => (
                                        <div key={material.id} className="flex items-center gap-4 rounded-md border p-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <File className="h-5 w-5 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <Input
                                                        value={material.name}
                                                        onChange={(e) => updateMaterialName(material.id, e.target.value)}
                                                        className="border-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    />
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{material.size}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => removeMaterial(material.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Remove file</span>
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="pt-2">
                                        <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Add More Files
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>


                    {/* Form actions */}
                    <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                                Reset
                            </Button>
                            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isDefault}>
                                {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                        </div>
                    </div>
            </Form>
        </div >
    )
}
