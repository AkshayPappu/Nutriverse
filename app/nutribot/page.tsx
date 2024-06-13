"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import ChatInput from "../components/AutoResizeTextArea";
import logo from "../assets/NutriverseLogo.png";
import user_icon from "../assets/user_icon.png";
import FullSidebar from "../components/FullSidebar";
import { ClipLoader } from "react-spinners";

export default function nutribot() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        }
    }, [session, status]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-green-50">
                <ClipLoader />
            </div>
        );
    }

    return (
        <>
            <FullSidebar />
            <div className="dashboard w-full h-screen flex flex-col p-5 overflow-hidden">
                <div className="header p-3 flex-shrink-0">
                    <h1 className="text-3xl font-medium text-gray-800">NutriBot</h1>
                </div>
                <hr className="border-t-1 border-black w-full" />
                <div className="chats space-y-4 p-4 mt-5 mb-5 flex-grow overflow-auto">
                    <div className="chat flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-green-200 flex items-center justify-center">
                        <img className="w-full h-full rounded-full" src={logo.src} alt="logo" />
                    </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-800">NutriBot</div>
                            <div className="text-sm bg-gray-100 p-2 rounded-lg">Hello! I'm NutriBot. How may I assist you?</div>
                            <div className="text-xs text-gray-500">10:00 AM</div>
                        </div>
                    </div>
                    <div className="chat flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-green-200 flex items-center justify-center">
                            <img className="w-full h-full rounded-full" src={user_icon.src} alt="logo" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-800">Akshay</div>
                            <div className="text-sm bg-gray-100 p-2 rounded-lg">Can you give me some good meals for dinner? I have 400 calories left.</div>
                            <div className="text-xs text-gray-500">10:02 AM</div>
                        </div>
                    </div>
                    <div className="chat flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-green-200 flex items-center justify-center">
                            <img className="w-full h-full rounded-full" src={logo.src} alt="logo" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-800">NutriBot</div>
                            <div className="text-sm bg-gray-100 p-2 rounded-lg">
                                <strong>Recipe: Grilled Chicken Salad with Mixed Greens</strong><br />
                                How about a grilled chicken salad with mixed greens? It's healthy and under 400 calories.<br /><br />
                                <strong>Price per serving:</strong> $5.00<br /><br />
                                <strong>Nutritional Information per serving:</strong><br />
                                - Calories: 350 kcal<br />
                                - Sugar: 5g<br />
                                - Saturated Fat: 2g<br />
                                - Protein: 30g
                            </div>
                            <div className="text-xs text-gray-500">10:03 AM</div>
                        </div>
                    </div>    
                </div>
                <ChatInput />
            </div>
            
        </>
    );
}
