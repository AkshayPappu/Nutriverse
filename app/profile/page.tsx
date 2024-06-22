"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from "react";
import FullSidebar from "../components/FullSidebar";
import { ClipLoader } from "react-spinners";

export default function Profile() {
    const { data: session, status } = useSession();
    console.log(session?.user);

    const [state, setState] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [weight, setWeight] = useState<number>(0);
    const [desiredWeight, setDesiredWeight] = useState<number>(0);
    const [cookingTimePerDay, setCookingTimePerDay] = useState<number>(0);
    const [exerciseDaysPerWeek, setExerciseDaysPerWeek] = useState<number>(0);
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
    const [heightFeet, setHeightFeet] = useState<number>(0);
    const [heightInches, setHeightInches] = useState<number>(0);

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        } else if (status === "authenticated" && session?.user) {
            setState(session.user.state || "");
            setEmail(session.user.email || "");
            setPassword(session.user.password || "");
            setCity(session.user.city || "");
            setWeight(session.user.weight || 0);
            setDesiredWeight(session.user.desiredWeight || 0);
            setCookingTimePerDay(session.user.cookingTimePerDay || 0);
            setExerciseDaysPerWeek(session.user.exerciseDaysPerWeek || 0);
            setDietaryRestrictions(session.user.dietaryRestrictions || "");
            const [feet, inches] = session.user.height?.split("'") || ["0", "0"];
            setHeightFeet(parseInt(feet, 10));
            setHeightInches(parseInt(inches.replace('"', ''), 10));
        }
    }, [status, session]);

    const handleSaveClicked = async (e: FormEvent) => {
        e.preventDefault();
        const height = `${heightFeet}'${heightInches}"`;

        const data = {
            email: email || "",
            password: password || "",
            city: city || "",
            state: state || "",
            height: height,
            weight: weight || 0,
            desired_weight: desiredWeight || 0,
            cooking_time_per_day: cookingTimePerDay || 0,
            exercise_days_per_week: exerciseDaysPerWeek || 0,
            dietary_restrictions: dietaryRestrictions || "",
        };
        console.log(`data: ${JSON.stringify(data)}`);

        try {
            console.log("updating profile");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${session?.user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 200) {
                const responseJson = await response.json();
                console.log(responseJson);
                let updatedUser = responseJson.object;

                // Re-sign in the user to update the session
                await signIn("credentials", {
                    redirect: false,
                    email: updatedUser.email,
                    password: updatedUser.password,
                });

                // Update local state
                setState(updatedUser.state || "");
                setEmail(updatedUser.email || "");
                setPassword(updatedUser.password || "");
                setCity(updatedUser.city || "");
                setWeight(updatedUser.weight || 0);
                setDesiredWeight(updatedUser.desiredWeight || 0);
                setCookingTimePerDay(updatedUser.cookingTimePerDay || 0);
                setExerciseDaysPerWeek(updatedUser.exerciseDaysPerWeek || 0);
                setDietaryRestrictions(updatedUser.dietaryRestrictions || "");
                setHeightFeet(parseInt(updatedUser.height.split("'")[0] ?? "0", 10));
                setHeightInches(parseInt(updatedUser.height.split("'")[1]?.replace('"', '') || "0", 10));

                alert("Profile updated successfully");
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        if (e.target.value === "0") {
            e.target.value = "";
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            e.target.value = "0";
            // Also update the corresponding state
            switch (e.target.id) {
                case "weight":
                    setWeight(0);
                    break;
                case "cookingTimePerDay":
                    setCookingTimePerDay(0);
                    break;
                case "height-feet":
                    setHeightFeet(0);
                    break;
                case "height-inches":
                    setHeightInches(0);
                    break;
                case "desiredWeight":
                    setDesiredWeight(0);
                    break;
                case "exerciseDaysPerWeek":
                    setExerciseDaysPerWeek(0);
                    break;
            }
        }
    };

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-green-50">
                <ClipLoader />
            </div>
        );
    }

    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", 
        "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
        "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", 
        "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    return (
        <>
            <FullSidebar />
            <div className="dashboard w-full h-screen flex flex-col p-5 overflow-hidden">
                <div className="header p-3 flex-shrink-0">
                    <h1 className="text-3xl font-medium text-gray-800">Profile</h1>
                </div>
                <hr className="border-t-1 border-black w-full" />
                <div className="form my-10 w-full flex justify-center overflow-auto max-h-screen">
                    <form className="max-w-2xl w-full" onSubmit={handleSaveClicked}>
                        <div className="grid grid-cols-1 mr-2 md:grid-cols-2 md:mr-2 gap-4">
                            <div>
                                <div className="mb-5">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weight (lbs)</label>
                                    <input 
                                        type="number" 
                                        id="weight" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={weight} 
                                        onChange={(e) => setWeight(parseInt(e.target.value))}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={city} 
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="cookingTimePerDay" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cooking Time Per Day</label>
                                    <input 
                                        type="number" 
                                        id="cookingTimePerDay" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={cookingTimePerDay} 
                                        onChange={(e) => setCookingTimePerDay(parseInt(e.target.value))}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Height</label>
                                    <div className="flex justify-between">
                                        <div className="flex w-1/2 mr-2 relative">
                                            <input
                                                type="number"
                                                id="height-feet"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
                                                value={heightFeet} 
                                                onChange={(e) => setHeightFeet(parseInt(e.target.value))}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            />
                                            <span className="absolute right-2 top-2.5 text-gray-900 text-sm">ft</span>
                                        </div>
                                        <div className="flex w-1/2 relative">
                                            <input
                                                type="number"
                                                id="height-inches"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
                                                value={heightInches} 
                                                onChange={(e) => setHeightInches(parseInt(e.target.value))}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            />
                                            <span className="absolute right-2 top-2.5 text-gray-900 text-sm">in</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="mb-5">
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="desiredWeight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Desired Weight</label>
                                    <input 
                                        type="number" 
                                        id="desiredWeight" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={desiredWeight} 
                                        onChange={(e) => setDesiredWeight(parseInt(e.target.value))}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
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
                                    <label htmlFor="dietaryRestrictions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dietary Restrictions</label>
                                    <input 
                                        type="text" 
                                        id="dietaryRestrictions" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={dietaryRestrictions} 
                                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="exerciseDaysPerWeek" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exercise Days Per Week</label>
                                    <input 
                                        type="number" 
                                        id="exerciseDaysPerWeek" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={exerciseDaysPerWeek} 
                                        onChange={(e) => setExerciseDaysPerWeek(parseInt(e.target.value))}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button 
                                type="submit" 
                                className="bg-gradient-to-tr from-green-300 to-green-200 text-green-800 hover:from-green-400 hover:to-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
