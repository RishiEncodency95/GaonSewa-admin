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
import { FiSliders, FiSettings, FiImage, FiMail } from "react-icons/fi";
import { BiSolidInstitution } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { SiOpenapiinitiative } from "react-icons/si";
import { FaDatabase, FaRegUser } from "react-icons/fa6";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("Drivers");

  const isActive = (path) => location.pathname === path;

  /* ======================
     SIDEBAR CONFIG (JSON)
  ====================== */
  const sidebarData = [
    {
      section: "MAIN",
      items: [
        { label: "Dashboard", path: "/", icon: MdDashboard },

        {
          label: "Home Section",
          icon: GoPersonFill,
          children: [
            { label: "Hero", path: "/hero" },
            { label: "Delegates List", path: "/delegateList" },
            { label: "New Data", path: "/newData" },
            { label: "Warm Data", path: "/warmData" },
            { label: "Hot Data", path: "/hotData" },
            { label: "Cold Data", path: "/coldData" },
            { label: "Master Delegate Data", path: "/masterDelegData" },
          ],
        },
        {
          label: "Member",
          icon: MdCardMembership,
          children: [
            { label: "Add Member", path: "/addMember" },
            { label: "Member Menu", path: "/memberMenu" },
          ],
        },
        {
          label: "Volunteer",
          icon: MdOutlineVolunteerActivism,
          children: [
            { label: "Add Volunteer", path: "/addVolunteer" },
            { label: "Volunteer Menu", path: "/volunteerMenu" },
          ],
        },
        {
          label: "Home Banner",
          icon: FiSliders,
          path: "/addSlider",
        },

        {
          label: "Media",
          icon: FiImage,
          children: [
            { label: "Photos Gallery", path: "/mediaImage" },
            { label: "Videos Gallery", path: "/mediaVideo" },
          ],
        },

        {
          label: "Communication",
          icon: FiMail,
          path: "",
        },

        {
          label: "Colleges",
          icon: BiSolidInstitution,
          children: [
            { label: "Add College", path: "/addCollege" },
            { label: "College List", path: "/collegeList" },
          ],
        },

        { label: "Initiatives", path: "/initiatives", icon: MdCorporateFare },

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
            { label: "Add Organization", path: "/addOrganization" },
            { label: "Add Designation", path: "/addDesignation" },
            { label: "Add Department", path: "/addDepartment" },
            { label: "Add Category", path: "/addCategory" },
            { label: "Add Profession", path: "/addProfession" },
            { label: "Add Event", path: "/addEvent" },
            { label: "Add Status", path: "/addStatus" },
            { label: "Add University", path: "/addUniversity" },
            { label: "Add Source", path: "/addSource" },
            { label: "Add Enquiry", path: "/addEnquiry" },
            { label: "Add Data", path: "/addSubData" },
            { label: "Add Target", path: "/addTarget" },
            { label: "Add Coordinator Status", path: "/addCoordiStatus" },
            { label: "Add Bank", path: "/addBank" },
            { label: "Image Category", path: "/imageCategory" },
            { label: "Video Category", path: "/videoCategory" },
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
