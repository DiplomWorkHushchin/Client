"use client"

import React, {useEffect} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Pencil, User} from "lucide-react";
import IUser from "@/intefaces/i-user";
import LoadingScreen from "@/components/loading/loading-sreen";
import {Badge} from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import {toast} from "@/hooks/use-toast";
import UploadImgBlock from "@/components/blocks/upload-img-block";
import {putUserPhotoAsync} from "@/services/user-service";
import {updateUserData} from "@/store/slices/auth-slice";
import axios from "axios";

export default function EditProfile() {
    const [loading, setLoading] = React.useState(true);
    const user: IUser | null = useSelector((state: RootState) => state.user.user);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    // Redux state dispatcher
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        setLoading(false);
    }, [])

    const handleImageSelect = async (file: File) => {
        try {
            const response = await putUserPhotoAsync(file);

            if (response.status === 200) {
                dispatch(updateUserData(response.data));
                setIsDialogOpen(false);
                toast({variant: "default", title: "Picture uploaded successfully"});
            } else {
                toast({variant: "destructive", title: "Picture upload failed"});
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data);
                toast({
                    variant: "destructive",
                    title: "Upload failed",
                    description: error.response?.data?.message || "Unknown error",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "An unexpected error occurred",
                });
            }
        }
    }

    return (
        <>
            {loading && <LoadingScreen/>}
            <div className={"p-4 smd:p-8 mt-0 flex flex-col"}>
                <div className={"flex items-center justify-center gap-4 smd:gap-6 md:gap-8"}>
                    <div className={"relative"}>
                        <Avatar className="h-26 w-26 smd:h-36 smd:w-36  md:h-56 md:w-56 rounded-full">
                            {user?.userPhoto ?
                                <AvatarImage
                                    src={process.env.NEXT_PUBLIC_BASE_API_URL + user?.userPhoto}
                                    alt={user?.userName}
                                    className={"overflow-hidden"}
                                /> : null
                            }
                            <AvatarFallback className="rounded-lg"><User className={"h-3/5 w-3/5"}/></AvatarFallback>
                        </Avatar>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger  asChild>
                                <Button
                                    className={"rounded-full w-8 h-8 cursor-pointer absolute bottom-0 right-0 smd:bottom-1 smd:right-1 md:bottom-3 md:right-3 z-20"}>
                                    <Pencil/>
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
                    <div className={"p-2 flex flex-col gap-4 w-full h-full"}>
                        <h1 className={"text-2xl smd:text-3xl md:text-5xl font-semibold"}>{`${user?.firstName} ${user?.lastName} ${user?.fatherName}`}</h1>
                        <Badge>{user?.userRoles}</Badge>
                    </div>
                </div>
            </div>
        </>
    )
}