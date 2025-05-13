"use client";

import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {useRouter} from "next/navigation";
import { RootState } from "@/store/store"; // Путь к вашему store

export default function Home() {
    const user = useSelector((state: RootState) => state.user);
    const token = user.token;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user || token) {
            router.replace("/dashboard");
        } else {
            router.replace("/login");
            setLoading(false);
        }
    }, [user, token, router]);

    if (loading) return <div className={"bg-background"}></div>;

    return null;
}
