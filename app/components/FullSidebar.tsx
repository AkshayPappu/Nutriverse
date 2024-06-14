import { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { LayoutDashboard, StickyNote, Salad, Settings } from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";

export const SidebarContext = createContext<{
    expanded: boolean;
    toggleExpanded: () => void;
}>({ expanded: true, toggleExpanded: () => {} });

const FullSidebar = () => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const pathname = usePathname();
    const [expanded, setExpanded] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const path = pathname.split("/")[1];
        setActiveItem(path);
    }, [pathname]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved_expanded = window.localStorage.getItem("sidebar_expanded");
            setExpanded(saved_expanded !== null ? JSON.parse(saved_expanded) : true);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            window.localStorage.setItem("sidebar_expanded", JSON.stringify(expanded));
        }
    }, [expanded, loading]);

    const toggleExpanded = () => setExpanded((prev) => !prev);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                {/* Optionally, you can add a loading spinner here */}
            </div>
        );
    }

    return (
        <SidebarContext.Provider value={{ expanded, toggleExpanded }}>
            <Sidebar expanded={expanded} toggleExpanded={toggleExpanded}>
                <Link href={"/dashboard"}>
                    <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={activeItem === "dashboard"} onClick={() => setActiveItem("dashboard")} />
                </Link>
                <Link href={"/nutribot"}>
                    <SidebarItem icon={<StickyNote size={20} />} text="NutriBot" active={activeItem === "nutribot"} onClick={() => setActiveItem("nutribot")} />
                </Link>
                <hr className="my-3" />
                <Link href={"/recipes"}>
                    <SidebarItem icon={<Salad size={20} />} text="Recipes" active={activeItem === "recipes"} onClick={() => setActiveItem("recipes")} />
                </Link>
                <Link href={"/profile"}>
                    <SidebarItem icon={<Settings size={20} />} text="Profile" active={activeItem === "profile"} onClick={() => setActiveItem("profile")} />
                </Link>
            </Sidebar>
        </SidebarContext.Provider>
    );
};

export default FullSidebar;
