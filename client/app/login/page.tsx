'use client';

import { signIn } from "next-auth/react";
import { SetStateAction, useState } from "react";
import logo from "../assets/logo.png";

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

    const handleSignUp = () => {
        window.location.href = "/signup";
    };

    const handleInputChange = (e: {
        target: { name: string; value: SetStateAction<string> };
    }) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else {
            setPassword(e.target.value);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img src={logo.src} alt="logo" className="w-20 h-20 mr-2" />
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 lg:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={(e) => handleSubmit(e)}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" 
                                placeholder="name@company.com" 
                                required 
                                value={email}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="••••••••" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" 
                                required 
                                value={password}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>                       
                        <button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Sign in</button>
                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm font-medium text-green-600 hover:underline dark:text-green-500">Forgot password?</a>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <button onClick={() => handleSignUp()} className="font-medium text-green-600 hover:underline dark:text-green-500">Sign up</button>
                            </p>
                        </div>
                    </form>
                    {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
}
