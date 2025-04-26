"use client"

import React, {use, useEffect} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User, UserRoundPen} from "lucide-react";
import {getUserAsync} from "@/services/user-service";
import IUser from "@/intefaces/i-user";
import LoadingScreen from "@/components/loading/loading-sreen";
import {Badge} from "@/components/ui/badge";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {Button} from "@/components/ui/button";
import Link from "next/link";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Profile({params}: { params: Promise<{ username: string }> }) {
    const userState: IUser | null = useSelector((state: RootState) => state.user.user);
    const unwrappedParams = use(params);
    const [user, setUser] = React.useState<IUser>();
    const [loading, setLoading] = React.useState(true);

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
            {loading && <LoadingScreen/>}
            <div className={"p-4 smd:p-8 mt-0 flex flex-col"}>
                <div className={"flex items-center justify-center gap-4 smd:gap-6 md:gap-8"}>
                    <Avatar className="h-26 w-26 smd:h-36 smd:w-36  md:h-56 md:w-56 rounded-full">
                        {user?.photoUrl ?
                            <AvatarImage
                                src={process.env.NEXT_PUBLIC_BASE_API_URL + user?.photoUrl}
                                alt={user?.userName}
                            /> : null
                        }
                        <AvatarFallback className="rounded-lg"><User className={"h-3/5 w-3/5"}/></AvatarFallback>
                    </Avatar>
                    <div className={"p-2 flex flex-col gap-4 w-full h-full"}>
                        <div className={"flex justify-between"}>
                            <h1 className={"text-2xl smd:text-3xl md:text-5xl font-semibold"}>{`${user?.firstName} ${user?.lastName} ${user?.fatherName}`}</h1>
                            {userState?.userName === user?.userName ?
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button asChild>
                                                <Link href={"/profile/edit"}><UserRoundPen/></Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit user profile</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                 : null}
                        </div>
                        {user?.userRoles.map((role, index) => (
                            <Badge key={index}>{role}</Badge>
                        ))}
                    </div>
                </div>
                <div className={"w-full"}>

                </div>
            </div>
        </>
    );
};
