"use client";

import LoadingScreen from '@/components/loading/loading-sreen';
import React, { useEffect, useState } from 'react';

export default function Chats() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false)
    }, []);


    return (
        <>
            {isLoading && <LoadingScreen />}
        </>
    )
};