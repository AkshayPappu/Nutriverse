'use client';

import { SetStateAction, useState } from "react";
import logo from "../assets/logo.png";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        city: "",
        state: "",
        weight: "",
        height: "",
        desiredWeight: "",
        cookingTimePerDay: "",
        dietaryRestrictions: "",
        exerciseDaysPerWeek: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        setError("");
        e.preventDefault();
        // Implement sign-up logic here
        console.log(formData);
    };

    const handleSignIn = () => {
        window.location.href = "/login";
    };

    const handleInputChange = (e: {
        target: { name: string; value: SetStateAction<string> };
    }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img src={logo.src} alt="logo" className="w-20 h-20 mr-2" />
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 lg:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create your account
                    </h1>
                    <form className="grid gap-4 md:gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                placeholder="name@company.com"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
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
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                            <input
                                type="text"
                                name="state"
                                id="state"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.state}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                id="weight"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.weight}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Height (cm)</label>
                            <input
                                type="text"
                                name="height"
                                id="height"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.height}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="desiredWeight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Desired Weight (kg)</label>
                            <input
                                type="number"
                                name="desiredWeight"
                                id="desiredWeight"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.desiredWeight}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="cookingTimePerDay" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cooking Time Per Day (minutes)</label>
                            <input
                                type="number"
                                name="cookingTimePerDay"
                                id="cookingTimePerDay"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.cookingTimePerDay}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="dietaryRestrictions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dietary Restrictions</label>
                            <input
                                type="text"
                                name="dietaryRestrictions"
                                id="dietaryRestrictions"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.dietaryRestrictions}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="exerciseDaysPerWeek" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exercise Days Per Week</label>
                            <input
                                type="number"
                                name="exerciseDaysPerWeek"
                                id="exerciseDaysPerWeek"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                                value={formData.exerciseDaysPerWeek}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Sign up</button>
                        </div>
                        <div className="md:col-span-2 flex items-center justify-between">
                            <a href="#" className="text-sm font-medium text-green-600 hover:underline dark:text-green-500">Forgot password?</a>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <button onClick={() => handleSignIn()} className="font-medium text-green-600 hover:underline dark:text-green-500">Sign in</button>
                            </p>
                        </div>
                    </form>
                    {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
}
