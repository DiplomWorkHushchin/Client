"use client"

import {Separator} from "@/components/ui/separator"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {ModeToggle} from "@/components/theme-mode-toggle";
import {usePathname} from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export function SiteHeader() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

    return (
        <header
            className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 pl-4 pr-2 lg:gap-2 lg:pl-6 lg:pr4">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <div className="flex items-center justify-between w-full">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {pathSegments.slice(-1).map((segment, index) => {
                                const href = "/" + pathSegments.slice(0, index + 1).join("/");
                                return (
                                    <BreadcrumbItem key={href}>
                                        <div className="flex items-center">
                                            <BreadcrumbPage
                                                className={"text-l font-semibold"}>
                                                {capitalize(segment)}
                                            </BreadcrumbPage>
                                        </div>
                                    </BreadcrumbItem>
                                )
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-2">
                        <ModeToggle/>
                    </div>
                </div>
            </div>
        </header>
    )
}
