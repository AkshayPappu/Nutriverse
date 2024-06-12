"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";


export default function recipes() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn();
        }
    }, [session, status]);

    return (
        <>
            <h1>Hello from Recipes</h1>
        </>
        
    )
}