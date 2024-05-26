import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/dashboard");
    }
    return (
        <h1>Hello from login</h1>
    )
}