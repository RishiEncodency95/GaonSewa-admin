import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdLogout,
  MdCorporateFare,
  MdVerified,
  MdSupportAgent,
  MdArticle,
  MdQuestionAnswer,
  MdCategory,
  MdCardMembership,
  MdOutlineVolunteerActivism,
} from "react-icons/md";
import {
  FaUserFriends,
  FaUserTie,
  FaCarSide,
  FaAmbulance,
  FaTruck,
  FaChevronDown,
  FaChevronUp,
  FaBlog,
} from "react-icons/fa";
import { GoPersonFill } from "react-icons/go";
import { FiSliders, FiSettings, FiImage, FiMail, FiLayers, FiGlobe } from "react-icons/fi";
import { BiSolidInstitution } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { SiOpenapiinitiative } from "react-icons/si";
import { FaDatabase, FaRegUser } from "react-icons/fa6";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("");

  const isActive = (path) => location.pathname === path;

  /* ======================
     SIDEBAR CONFIG (JSON)
  ====================== */
  const sidebarData = [
    {
      section: "SUPER ADMIN",
      items: [
        {
          label: "Companies",
          icon: MdCorporateFare,
          path: "/companies",
        },
        {
          label: "Branches",
          icon: MdDashboard,
          path: "/branches",
        },


        // {
        //   label: "Manage",
        //   icon: BiSolidInstitution,
        //   children: [
        //     { label: "Branches", path: "/branches" },
        //     { label: "Branch Users", path: "/branch-users" },
        //   ],
        // },
      ],
    },
    {
      section: "MAIN",
      items: [
        { label: "Dashboard", path: "/", icon: MdDashboard },

        {
          label: "Operations",
          icon: FiLayers,
          children: [
            { label: "Dashboard", path: "/" },
            { label: "Products", path: "/products" },
            { label: "Orders", path: "/orders" },
          ],
        },
        {
          label: "Management",
          icon: FiSettings,
          children: [
            { label: "Branches", path: "/branches" },
            { label: "Roles", path: "/roles" },
          ],
        },
        {
          label: "Website",
          icon: FiGlobe,
          children: [
            { label: "Hero Section", path: "/hero" },
          ],
        },
      ],
    },
    {
      section: "ADMIN MANAGEMENT",
      items: [
        {
          label: "Add By Admin",
          icon: FaDatabase,
          children: [
            { label: "Add Occupation", path: "/addOccupation" },

          ],
        },

        {
          label: "Users",
          icon: FaRegUser,
          children: [
            { label: "Add User", path: "/addUser" },
            { label: "User List", path: "/userList" },
          ],
        },
      ],
    },

    {
      section: "CONTENT",
      items: [
        {
          label: "Blogs",
          icon: MdArticle,
          children: [
            { label: "Add Blog", path: "/addBlog" },
            { label: "Blog List", path: "/blogList" },
          ],
        },
        { label: "FAQ", path: "/faq", icon: MdQuestionAnswer },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      {/* LOGO */}
      <div className="h-15 px-4 flex justify-center items-center shadow-md">
        <img
          src="/namo_gange.png"
          alt="Namo Gange"
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {sidebarData.map((section) => (
          <div key={section.section} className="mb-4">
            <p className="text-xs text-gray-400 px-3 mb-1">{section.section}</p>

            {section.items.map((item) => {
              const Icon = item.icon;

              /* ===== NESTED MENU ===== */
              if (item.children) {
                const isOpen = openMenu === item.label;

                return (
                  <div key={item.label}>
                    <div
                      onClick={() => setOpenMenu(isOpen ? "" : item.label)}
                      className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Icon />
                        {item.label}
                      </div>
                      {isOpen ? (
                        <FaChevronUp size={12} />
                      ) : (
                        <FaChevronDown size={12} />
                      )}
                    </div>

                    {isOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <div
                              key={child.path}
                              onClick={() => navigate(child.path)}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm
                                ${isActive(child.path)
                                  ? "bg-blue-50 text-[#0C55A0] font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              {/* <ChildIcon size={14} /> */}
                              {child.label}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              /* ===== NORMAL MENU ===== */
              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm
                    ${isActive(item.path)
                      ? "bg-blue-50 text-[#0C55A0] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon />
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t-3 border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm">
          <MdLogout />
          Logout
        </button>
      </div>
    </aside>
  );
}
