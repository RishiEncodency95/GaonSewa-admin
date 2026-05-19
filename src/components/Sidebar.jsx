import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSidebars } from "../features/add_by_admin/sidebarSlice";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as FiIcons from "react-icons/fi";

const DynamicIcon = ({ iconName, className }) => {
  if (!iconName) return <MdIcons.MdOutlineFiberManualRecord className={className} size={10} />;
  const IconComp = MdIcons[iconName] || FaIcons[iconName] || Fa6Icons[iconName] || FiIcons[iconName];
  return IconComp ? <IconComp className={className} size={16} /> : <MdIcons.MdOutlineFiberManualRecord className={className} size={10} />;
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState("");

  const { sidebars = [], loading, isFetched } = useSelector((state) => state.sidebars || {});

  useEffect(() => {
    if (!isFetched && !loading) {
      dispatch(fetchSidebars());
    }
  }, [dispatch, isFetched, loading]);

  const isActive = (path) => location.pathname === path;

  /* ======================
     DYNAMIC SIDEBAR CONFIG
  ====================== */
  const buildSidebarData = (data) => {
    const sectionsMap = {};

    const activeItems = [...data]
      .filter((item) => item.status === "Active")
      .sort((a, b) => {
        if ((a.sectionOrder || 0) !== (b.sectionOrder || 0)) {
          return (a.sectionOrder || 0) - (b.sectionOrder || 0);
        }
        return (a.order || 0) - (b.order || 0);
      });

    activeItems.forEach((item) => {
      const sOrder = item.sectionOrder || 0;
      if (!sectionsMap[item.section]) {
        sectionsMap[item.section] = {
          section: item.section,
          items: [],
          sectionOrder: sOrder,
        };
      } else {
        // Ensure we use the highest sectionOrder defined for any item in this section
        if (sOrder > sectionsMap[item.section].sectionOrder) {
          sectionsMap[item.section].sectionOrder = sOrder;
        }
      }

      // If this item is a root menu item (no parent)
      if (!item.parentMenu || item.parentMenu.trim() === "" || item.parentMenu === "None") {
        const children = activeItems.filter(
          (child) => child.parentMenu === item.label && child.section === item.section
        );

        sectionsMap[item.section].items.push({
          ...item,
          children: children.length > 0 ? children : null,
        });
      }
    });

    // Final sort of sections by sectionOrder
    return Object.values(sectionsMap).sort((a, b) => a.sectionOrder - b.sectionOrder);
  };

  const sidebarData = buildSidebarData(sidebars);

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
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-sm text-gray-400 animate-pulse">Loading menu...</p>
          </div>
        ) : (
          sidebarData.map((section) => (
            <div key={section.section} className="mb-4">
              <p className="text-xs text-gray-400 px-3 mb-1">{section.section}</p>

              {section.items.map((item) => {
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
                          <DynamicIcon iconName={item.icon} />
                          {item.label}
                        </div>
                        {isOpen ? (
                          <FaIcons.FaChevronUp size={12} />
                        ) : (
                          <FaIcons.FaChevronDown size={12} />
                        )}
                      </div>

                      {isOpen && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => {
                            return (
                              <div
                                key={child._id || child.path}
                                onClick={() => navigate(child.path || "#")}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm
                                ${isActive(child.path)
                                    ? "bg-blue-50 text-[#0C55A0] font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                                  }`}
                              >
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
                    key={item._id || item.path}
                    onClick={() => navigate(item.path || "#")}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm
                    ${isActive(item.path)
                        ? "bg-blue-50 text-[#0C55A0] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <DynamicIcon iconName={item.icon} />
                    {item.label}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t-3 border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm">
          <MdIcons.MdLogout />
          Logout
        </button>
      </div>
    </aside>
  );
}
