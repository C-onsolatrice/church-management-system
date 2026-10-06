"use client"

import Link from "next/link";
import {
LayoutDashboard,
Users,
Wallet,
Calendar,
Megaphone,
Settings
} from "lucide-react";


export default function Sidebar(){


return (

<aside className="
hidden
md:flex
w-72
bg-white
shadow-lg
min-h-screen
flex-col
p-6
">


{/* Logo */}

<div className="
flex
items-center
gap-3
mb-10
">


<div className="
bg-blue-600
text-white
rounded-full
p-3
">

⛪

</div>


<h1 className="
text-xl
font-bold
text-gray-900
">

ConsolaCMS

</h1>


</div>




<nav className="space-y-3">



<Menu 
icon={<LayoutDashboard/>}
name="Dashboard"
link="/dashboard"
/>


<Menu 
icon={<Users/>}
name="Members"
link="/members"
/>


<Menu 
icon={<Wallet/>}
name="Tithes"
link="/tithes"
/>



<Menu 
icon={<Calendar/>}
name="Events"
link="/events"
/>



<Menu 
icon={<Megaphone/>}
name="Announcements"
link="/announcements"
/>



<Menu 
icon={<Settings/>}
name="Settings"
link="/settings"
/>


</nav>


</aside>

)

}



function Menu({
icon,
name,
link
}:{
icon:any,
name:string,
link:string
}){


return (

<Link

href={link}

className="
flex
items-center
gap-4
p-3
rounded-lg
text-gray-700
hover:bg-blue-50
hover:text-blue-600
transition
"

>


{icon}

<span>
{name}
</span>


</Link>


)

}