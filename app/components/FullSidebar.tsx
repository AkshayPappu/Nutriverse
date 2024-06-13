import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import Sidebar from "./Sidebar";
import { SidebarItem } from "../components/Sidebar";
import { LayoutDashboard, StickyNote, Salad, Settings } from "lucide-react";

const FullSidebar = () => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const path = pathname.split("/")[1];
        setActiveItem(path);
    }
    , [pathname]);


  const handleClicked = (item: string) => {
    setActiveItem(item);
    console.log(`Clicked ${item}`)
    
  };
    return (
        <Sidebar>
            <Link href={"/dashboard"}>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={activeItem === "dashboard"} onClick={() => {handleClicked("dashboard")}}/>
            </Link>
            <Link href={"/nutribot"}>
                <SidebarItem icon={<StickyNote size={20} />} text="NutriBot" active={activeItem === "nutribot"} onClick={() => {handleClicked("nutribot")}}/>
            </Link>
            <hr className="my-3" />
            <Link href={"/recipes"}>
                <SidebarItem icon={<Salad size={20} />} text="Recipes" active={activeItem === "recipes"} onClick={() => {handleClicked("recipes")}}/>
            </Link>
            <Link href={"/profile"}>
                <SidebarItem icon={<Settings size={20} />} text="Profile" active={activeItem === "profile"} onClick={() => {handleClicked("profile")}}/>
            </Link>
        </Sidebar>
    );
}

export default FullSidebar;