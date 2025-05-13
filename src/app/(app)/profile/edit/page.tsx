"use client"

import React, { useEffect, useState } from 'react';
import IUser from "@/types/i-user";
import LoadingScreen from "@/components/loading/loading-sreen";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import UploadImgBlock from "@/components/blocks/upload-img-block";
import { patchUserEditAsync, putUserPhotoAsync } from "@/services/user-service";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2Icon, Pencil, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DatePickerDemo } from '@/components/ui/date-picker';
import UpdateUserProfileDTO from '@/DTOs/update-user-profile-dto';

const formSchema = z.object({
    userName: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    phoneNumber: z.string().optional(),
    firstName: z.string().min(1, {
        message: "First name is required.",
    }),
    lastName: z.string().min(1, {
        message: "Last name is required.",
    }),
    fatherName: z.string().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
});

export default function EditProfile() {
    const [loading, setLoading] = useState(true);
    const user: IUser | null = useSelector((state: RootState) => state.user.user);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDefault, setIsDefault] = useState(true);
    const router = useRouter();

    const defaultValues = {
        userName: user?.userName,
        phoneNumber: user?.phoneNumber,
        firstName: user?.firstName,
        lastName: user?.lastName,
        fatherName: user?.fatherName,
        gender: user?.gender ?? "Other",
        dateOfBirth: user?.dateOfBirth ?? "",
        country: user?.country ?? "",
        city: user?.city ?? ""
    }

    // User edit profile forn instance with data from redux store (current user data state)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    // Redux state dispatcher
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const subscription = form.watch((currentValues) => {
            const isEqual = JSON.stringify(currentValues) === JSON.stringify(defaultValues);
            setIsDefault(isEqual);
        });

        setLoading(false);

        return () => subscription.unsubscribe();
    }, [form]);

    // Handle image selection and upload
    const handleImageSelect = async (file: File) => {
        const response = await putUserPhotoAsync(file, dispatch);
        setIsDialogOpen(false);
    }

    // Updated user data on form submit
    async function onSubmitUserEditProfile(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        const userUpdated: UpdateUserProfileDTO = {
            userName: values.userName,
            phoneNumber: values.phoneNumber,
            firstName: values.firstName,
            lastName: values.lastName,
            fatherName: values.fatherName,
            gender: values.gender,
            dateOfBirth: values.dateOfBirth,
            country: values.country,
            city: values.city
        }

        await patchUserEditAsync(userUpdated, dispatch);

        setIsSubmitting(false);
    }

    return (
        <>
            {loading && <LoadingScreen />}
            <div>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col">
                        <div className="flex flex-col gap-6 p-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmitUserEditProfile)} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Card className="md:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Profile Photo</CardTitle>
                                                <CardDescription>Upload a profile photo to personalize your account.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-col h-full items-center gap-4 sm:flex-row">
                                                    <div className={"relative"}>
                                                        <Avatar className="h-36 w-36 md:h-56 md:w-56 rounded-full">
                                                            {user?.photoUrl ?
                                                                <AvatarImage
                                                                    src={process.env.NEXT_PUBLIC_BASE_API_URL + user?.photoUrl}
                                                                    alt={user?.userName}
                                                                    className={"overflow-hidden"}
                                                                /> : null
                                                            }
                                                            <AvatarFallback className="rounded-lg"><User className={"h-3/5 w-3/5"} /></AvatarFallback>
                                                        </Avatar>
                                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    className={"rounded-full w-8 h-8 cursor-pointer absolute bottom-0 right-0 smd:bottom-1 smd:right-1 md:bottom-3 md:right-3 z-20"}>
                                                                    <Pencil />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent >
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit user picture</DialogTitle>
                                                                    <DialogDescription>Select new profile picture. Click on image or drag-drop to dashed area.</DialogDescription>
                                                                </DialogHeader>

                                                                <UploadImgBlock
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
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Personal Information */}
                                        <Card className="md:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Personal Information</CardTitle>
                                                <CardDescription>Update your personal details.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-6 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter your first name" {...field} />
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
                                                            <FormLabel>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter your last name" {...field} />
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
                                                            <FormLabel>Father's Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter your father's name" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="gender"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Gender</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select gender" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Male">Male</SelectItem>
                                                                    <SelectItem value="Female">Female</SelectItem>
                                                                    <SelectItem value="Other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="dateOfBirth"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Date of Birth</FormLabel>
                                                            <DatePickerDemo value={field.value} onChange={field.onChange} />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* Contact Information */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Contact Information</CardTitle>
                                                <CardDescription>Update your contact details.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="userName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Username</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter your username" {...field} />
                                                            </FormControl>
                                                            <FormDescription>This is your public display name.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="phoneNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter your phone number" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* Location Information */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Location</CardTitle>
                                                <CardDescription>Update your location details.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="country"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Country</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter your country" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="city"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>City</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter your city" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push(`/profile/${user?.userName}`)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting || isDefault}>
                                            {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}