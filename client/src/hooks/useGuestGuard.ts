"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";

export const useGuestGuard = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await getCurrentUser();

                // User is authenticated
                router.replace("/dashboard");
            } catch (error) {
                // User is not authenticated
                // Stay on login/register page
            }
        };

        checkAuthentication();
    }, [router]);
};