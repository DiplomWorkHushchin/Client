"use client"

import {
   User
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import Link from "next/link";
import React from "react";

export function NavUser() {
    const user = useSelector((state: RootState) => state.user.user);
    
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                    <Link href={"/profile/" + user?.userName}>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {user?.photoUrl ?  <AvatarImage
                                    src={process.env.NEXT_PUBLIC_BASE_API_URL + user?.photoUrl}
                                    alt={user?.userName}
                                    className={"overflow-hidden scale-110 flex justify-center items-center"}
                                /> : null}
                                <AvatarFallback className="rounded-lg"><User/></AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.firstName + " " + user?.lastName}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                {user?.userRoles && Array.isArray(user.userRoles) && user.userRoles.map((role, index) => (
                                    <p key={index}>{role}</p>
                                ))}
                            </span>
                            </div>
                        </SidebarMenuButton>
                    </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
