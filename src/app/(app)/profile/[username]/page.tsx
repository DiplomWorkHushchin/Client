"use client"

import React, { use, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, CalendarIcon, Divide, Mail, MapPin, MapPinIcon, PhoneCall, PhoneIcon, User, UserIcon, UserRoundPen, UsersIcon } from "lucide-react";
import { getUserAsync } from "@/services/user-service";
import IUser from "@/types/i-user";
import LoadingScreen from "@/components/loading/loading-sreen";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

export default function Profile({ params }: { params: Promise<{ username: string }> }) {
    const userState: IUser | null = useSelector((state: RootState) => state.user.user);
    const unwrappedParams = use(params);
    const [user, setUser] = useState<IUser>();
    const userAuthUsername: string | null = useSelector((state: RootState) => state.user.user?.userName || null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserAsync(unwrappedParams.username);
            setUser(response);
            setLoading(false);
        }

        fetchUser();
    }, [])

    return (
        <>
            {loading && <LoadingScreen />}
            <div className={"p-4 smd:p-8 mt-0 flex flex-col gap-2"}>
                <div className={"flex flex-col smd:flex-row justify-center gap-4 smd:gap-6 md:gap-8"}>
                    <div className='flex flex-col justify-start gap-4 items-center'>
                        <Avatar className="h-26 w-26 smd:h-36 smd:w-36  md:h-56 md:w-56 rounded-full">
                            {user?.photoUrl ?
                                <AvatarImage
                                    src={process.env.NEXT_PUBLIC_BASE_API_URL + user?.photoUrl}
                                    alt={user?.userName}
                                /> : null
                            }
                            <AvatarFallback className="rounded-lg"><User className={"h-3/5 w-3/5"} /></AvatarFallback>
                        </Avatar>
                        <div className='flex items-center justify-start gap-4 w-full'>
                            {user?.userRoles ?
                                user.userRoles.map((role, index) => (
                                    <Badge className="cursor-pointer" key={index}>{role}</Badge>

                                )) : null}
                            {user?.group ?
                                <h1 className="cursor-pointer">{user.group}</h1> : null}
                        </div>
                        {userAuthUsername === unwrappedParams.username ?
                            <Button className="w-full" variant={"secondary"} asChild>
                                <Link href={`/profile/edit`}>Edit profile</Link>
                            </Button> : null}

                    </div>
                    <div className='flex-1 flex flex-col gap-4 justify-start' >
                        <div>
                            <h1 className='text-xl smd:text-3xl md:text-4xl font-bold'>{user?.firstName} {user?.lastName} {user?.fatherName}</h1>
                            <h1 className='text-sm smd:text-base md:text-lg text-gray-500'>@{user?.userName}</h1>
                        </div>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="grid gap-6">
                                            <div>
                                                <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Username:</span>
                                                        <span>{user?.userName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-muted-foreground"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M21 5v14h-18v-14h18zm-18 0l9 6.5 9-6.5"></path>
                                                        </svg>
                                                        <span className="text-sm text-muted-foreground">Email:</span>
                                                        <span>{user?.email || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Phone:</span>
                                                        <span>{user?.phoneNumber || "-"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h2 className="mb-4 text-xl font-semibold">Location</h2>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="flex items-center gap-2">
                                                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Country:</span>
                                                        <span>{user?.country || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-muted-foreground"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"></path>
                                                            <circle cx="12" cy="10" r="3"></circle>
                                                        </svg>
                                                        <span className="text-sm text-muted-foreground">City:</span>
                                                        <span>{user?.city || "-"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="details" className="mt-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="grid gap-6">
                                            <div>
                                                <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">First Name:</span>
                                                        <span>{user?.firstName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Last Name:</span>
                                                        <span>{user?.lastName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Father's Name:</span>
                                                        <span>{user?.fatherName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Gender:</span>
                                                        <span>{user?.gender}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Date of Birth:</span>
                                                        <span>{user?.dateOfBirth ? user.dateOfBirth : "-"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Group:</span>
                                                        <span>{user?.group}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h2 className="mb-4 text-xl font-semibold">Roles & Permissions</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {user?.userRoles.map((role) => (
                                                        <Badge key={role} variant="outline">
                                                            {role}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};
