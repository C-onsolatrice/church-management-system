"use client";

import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";


export default function Navbar() {

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">

        <Search
          size={18}
          className="text-gray-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />

      </div>


      {/* Right section */}
      <div className="flex items-center gap-6">


        {/* Notification */}
        <button className="relative">

          <Bell
            size={22}
            className="text-gray-600"
          />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>

        </button>



        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            A
          </div>


          <div className="hidden md:block">

            <p className="text-sm font-semibold">
              Admin User
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>

          </div>


          <ChevronDown
            size={18}
            className="text-gray-500"
          />

        </div>


      </div>


    </header>
  );
}