"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Profile() {
    /** 
    const { data: session, status } = useSession();
    const [state, setState] = useState("");

    useEffect(() => {
        if (status === "authenticated") {
            setState(session.user.state);
        } else if (status === "unauthenticated") {
            signIn();
        }
    }, [session, status]);
    */
    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", 
        "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
        "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", 
        "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard w-full h-screen flex flex-col p-5 overflow-hidden">
            <div className="header p-3 flex-shrink-0">
                <h1 className="text-3xl font-medium text-gray-800">Profile</h1>
            </div>
            <hr className="border-t-1 border-black w-full" />
            <div className="form my-10 w-full flex justify-center overflow-auto max-h-screen">
                <form className="max-w-2xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="mb-5">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" defaultValue={session?.user.email} />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                <input type="text" id="city" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                                <select
                                    id="state"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <option value="" disabled>Select your state</option>
                                    {states.map((stateName) => (
                                        <option key={stateName} value={stateName}>{stateName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weight (lbs)</label>
                                <input type="number" id="weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                        </div>
                        <div>
                            <div className="mb-5">
                                <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Height</label>
                                <input type="text" id="height" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="desiredWeight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Desired Weight</label>
                                <input type="number" id="desiredWeight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="cookingTimePerDay" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cooking Time Per Day</label>
                                <input type="number" id="cookingTimePerDay" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="dietaryRestrictions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dietary Restrictions</label>
                                <input type="text" id="dietaryRestrictions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="exerciseDaysPerWeek" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exercise Days Per Week</label>
                                <input type="number" id="exerciseDaysPerWeek" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button type="button" className="bg-gradient-to-tr from-green-300 to-green-200 text-green-800 hover:from-green-400 hover:to-green-300 
                                    font-medium rounded-lg text-sm px-5 py-2.5">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
