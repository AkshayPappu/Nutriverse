"use client";
import { signIn } from "next-auth/react";
import { SetStateAction, useState } from "react";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        setError("");
        e.preventDefault();
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result && result.status === 200) {
            window.location.href = "/dashboard";
            return;
        }

        setError("Invalid credentials");
    };

    const handleInputChange = (e: {
        target: { name: string; value: SetStateAction<string> };
    }) => {
        if (e.target.name === "email") {
            console.log(e.target.value);
            setEmail(e.target.value);
        } else {
            setPassword(e.target.value);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <h1>Email</h1>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => handleInputChange(e)}
                />
                <h1>Password</h1>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => handleInputChange(e)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}