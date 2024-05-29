"use client";
import { ChevronFirst, ChevronLast, LogOut } from "lucide-react";
import logo from "../assets/NutriverseLogo.png";
import { createContext, useContext, useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

const SidebarContext = createContext<{ expanded: boolean }>({} as { expanded: boolean });

export default function Sidebar({ children }: { children: React.ReactNode }) {
    // Store sidebar expanded state in local storage
    const [expanded, setExpanded] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState(false);

    // Effect to sync state with localStorage only after component is mounted
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved_expanded = window.localStorage.getItem("sidebar_expanded");
            setExpanded(saved_expanded !== null ? JSON.parse(saved_expanded) : true);
            setIsMounted(true);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            window.localStorage.setItem("sidebar_expanded", JSON.stringify(expanded));
        }
    }, [expanded, isMounted]);

    if (!isMounted) {
        return (
            <div className="flex justify-center items-center h-screen w-screen fixed top-0 left-0 bg-white z-50">
                <ClipLoader />
            </div>
        ); // Render full-screen spinner until mounted
    }

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img src={logo.src} className={`overflow-hidden transition-all ${expanded ? "w-10" : "w-0"}`} />
                    <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="border-t flex p-3 justify-center items-center">
                    <div className={`flex justify-between overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"} `}>
                        <div className="leading-4">
                            <h4 className="font-semibold">AkshayPappu</h4>
                            <span className="text-xs text-gray-600">akshaypap2005@gmail.com</span>
                        </div>
                    </div>
                    <LogOut size={20} />
                </div>
            </nav>
        </aside>
    );
}

export function SidebarItem({ icon, text, active, onClick }: { icon: any, text: any, active: boolean, onClick: () => void }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li onClick={onClick} className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-green-300 to-green-200 text-green-800" : "hover:bg-green-50 text-gray-600"}`}>
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>

            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-green-100 text-green-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </li>
    );
}
