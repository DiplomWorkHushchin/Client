"use client"

import LoadingScreen from "@/components/loading/loading-sreen"
import { useEffect, useState } from "react";

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false)
    }, []);


    return (
        <>
            {isLoading && <LoadingScreen />}
        </>
    )
}
