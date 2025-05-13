"use client"

import {
    LogOutIcon,
    MoreVerticalIcon,
    User,
    UserCircleIcon
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
    useSidebar,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutAsync } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import {useDispatch} from "react-redux";
import { logoutUser } from "@/store/slices/auth-slice";



export function NavUser() {
    const user = useSelector((state: RootState) => state.user.user);
    const { isMobile } = useSidebar();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = async () => {
        await logoutAsync();
        dispatch(logoutUser());
        router.replace("/login");
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {user?.photoUrl ? <AvatarImage
                                    src={process.env.NEXT_PUBLIC_BASE_API_URL + user?.photoUrl}
                                    alt={user?.userName}
                                    className={"overflow-hidden scale-110 flex justify-center items-center"}
                                /> : null}
                                <AvatarFallback className="rounded-lg"><User /></AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.firstName + " " + user?.lastName}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user?.userRoles && Array.isArray(user.userRoles) && user.userRoles.map((role: string, index: React.Key | null | undefined) => (
                                        <p key={index}>{role}</p>
                                    ))}
                                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-2 font-normal">
                            <Avatar className="h-8 w-8 rounded-lg">
                                {user?.photoUrl ? <AvatarImage
                                    src={process.env.NEXT_PUBLIC_BASE_API_URL + user?.photoUrl}
                                    alt={user?.userName}
                                    className={"overflow-hidden scale-110 flex justify-center items-center"}
                                /> : null}
                                <AvatarFallback className="rounded-lg"><User /></AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.firstName + " " + user?.lastName}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user?.userRoles && Array.isArray(user.userRoles) && user.userRoles.map((role: string, index: React.Key | null | undefined) => (
                                        <p key={index}>{role}</p>
                                    ))}
                                </span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href={`/profile/${user?.userName}`} className="flex items-center gap-2 w-full h-full">
                                <UserCircleIcon />
                                Profile
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                            <LogOutIcon/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
