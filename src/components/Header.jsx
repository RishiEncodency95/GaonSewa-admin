import { useState, useRef, useEffect } from "react";
import {
  MdNotifications,
  MdLogout,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-15 bg-white shadow-md flex items-center justify-between px-6">
      {/* SEARCH */}
      <div className="h-15 px-4 py-4 ">
        <h1 className="text-xl font-medium text-center text-[#0C55A0]">
          Welcome Admin
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-8 relative">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <MdNotifications size={22} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        </div>

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>
          {/* PROFILE AVATAR */}
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full 
    bg-gradient-to-r from-[#F36B2A] to-[#0C55A0]
    flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition"
          >
            <FaUserCircle className="text-white text-2xl" />
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              {/* USER INFO */}
              <div className="px-4 py-3 border-b border-gray-300 bg-gray-30">
                <p className="text-sm font-semibold text-gray-800">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">admin@namo-gange.com</p>
              </div>

              {/* MENU */}
              <div className="py-1">
                <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition">
                  <FaUserCircle className="text-[#0C55A0] text-lg" />
                  Profile
                </div>

                <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition">
                  <MdSettings className="text-[#F36B2A] text-lg" />
                  Settings
                </div>
              </div>

              {/* LOGOUT */}
              <div className="border-t border-gray-200">
                <div className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition">
                  <MdLogout className="text-lg" />
                  Logout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
