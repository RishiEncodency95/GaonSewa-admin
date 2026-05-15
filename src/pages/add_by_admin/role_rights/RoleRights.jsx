import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoleRights,
  getAllRoleRights,
  updateRoleRights,
  deleteRoleRights,
} from "../../../features/add_by_admin/role_rights/roleRightsSlice";
import { fetchRoles } from "../../../features/add_by_admin/roleSlice";
import { fetchSidebars } from "../../../features/add_by_admin/sidebarSlice";
import { showToast } from "../../../utlity/toastUtils";

const RoleRights = () => {
  const dispatch = useDispatch();
  const { roleRightsList, loading } = useSelector(
    (state) => state.roleRights || {},
  );
  const { roles: allRoles } = useSelector((state) => state.roles || {});
  const { sidebars } = useSelector((state) => state.sidebars || {});
  const allRolesList = allRoles?.filter((role) => role.status === "Active");

  const authUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    _id: null,
    role: "",
    permissions: [],
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize permissions state
  useEffect(() => {
    dispatch(getAllRoleRights());
    dispatch(fetchRoles());
    dispatch(fetchSidebars());
  }, [dispatch]);

  // Transform sidebars data into sections
  const sidebarPages = useMemo(() => {
    if (!sidebars) return [];
    const sections = {};

    sidebars.forEach((item) => {
      if (item.status === "Active") {
        const sectionName = item.section || "MAIN";
        if (!sections[sectionName]) {
          sections[sectionName] = [];
        }
        sections[sectionName].push(item);
      }
    });

    const SECTION_ORDER = [
      "MAIN",
      "PARTNER SECTION",
      "EVENT SECTION",
      "ADMIN MANAGEMENT",
      "CONTENT",
    ];

    return Object.keys(sections)
      .sort((a, b) => {
        const indexA = SECTION_ORDER.indexOf(a);
        const indexB = SECTION_ORDER.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      })
      .map((section) => ({
        section,
        items: sections[section],
        // items: sections[section].sort((a, b) => (a.order_by || 0) - (b.order_by || 0)),
      }));
  }, [sidebars]);

  // Helper to initialize empty permissions
  const getInitialPermissions = () => {
    const perms = [];
    sidebarPages.forEach((section) => {
      section.items.forEach((item) => {
        perms.push({
          page: item.label,
          read: false,
          write: false,
          delete: false,
        });
      });
    });
    return perms;
  };

  useEffect(() => {
    if (!isEdit) {
      setFormData((prev) => ({
        ...prev,
        permissions: getInitialPermissions(),
      }));
    }
  }, [isEdit, sidebarPages]);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    // Check if rights already exist for this role to switch to edit mode automatically?
    // For now, just set the role.
    setFormData({ ...formData, role: selectedRole });
  };

  const handlePermissionChange = (pageName, type) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.map((p) => {
        if (p.page === pageName) {
          return { ...p, [type]: !p[type] };
        }
        return p;
      });
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSelectAll = (pageName, checked) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.map((p) => {
        if (p.page === pageName) {
          return { ...p, read: checked, write: checked, delete: checked };
        }
        return p;
      });
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleGlobalSelectAll = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => {
      const newPermissions = prev.permissions.map((p) => ({
        ...p,
        read: checked,
        write: checked,
        delete: checked,
      }));
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleColumnSelectAll = (type, checked) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.map((p) => ({
        ...p,
        [type]: checked,
      }));
      return { ...prev, permissions: newPermissions };
    });
  };
  const handleSectionSelectAll = (sectionName, checked) => {
    const section = sidebarPages.find((s) => s.section === sectionName);
    if (!section) return;

    const pageNames = section.items.map((item) => item.label);

    setFormData((prev) => {
      const newPermissions = prev.permissions.map((p) => {
        if (pageNames.includes(p.page)) {
          return { ...p, read: checked, write: checked, delete: checked };
        }
        return p;
      });
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      showToast.error("Please select a role");
      return;
    }

    setIsSubmitting(true);
    const currentUserId = authUser?.id || null;
    const currentUserName = authUser?.username || "";

    try {
      if (isEdit) {
        await dispatch(
          updateRoleRights({
            id: formData._id,
            data: {
              ...formData,
              updated_by: currentUserName,
              user_id: currentUserId,
            },
          }),
        ).unwrap();
        showToast.success("Role Rights updated successfully");
      } else {
        // Check if role already exists in list
        const exists = roleRightsList.find((r) => r.role === formData.role);
        if (exists) {
          showToast.error("Rights for this role already exist. Please edit instead.");
          setIsSubmitting(false);
          return;
        }

        await dispatch(
          createRoleRights({
            ...formData,
            created_by: currentUserName,
            user_id: currentUserId,
          }),
        ).unwrap();
        showToast.success("Role Rights added successfully");
      }
      dispatch(getAllRoleRights());
      resetForm();
    } catch (err) {
      console.error(err);
      showToast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      role: "",
      permissions: getInitialPermissions(),
    });
    setIsEdit(false);
  };

  const handleEdit = (item) => {
    // Merge saved permissions with current sidebar structure to handle new pages
    const initialPerms = getInitialPermissions();
    const mergedPermissions = initialPerms.map((def) => {
      const saved = item.permissions.find((p) => p.page === def.page);
      return saved ? saved : def;
    });

    setFormData({
      _id: item._id,
      role: item.role,
      permissions: mergedPermissions,
    });
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const currentUserId = authUser?.id || null;
    if (window.confirm("Are you sure you want to delete these rights?")) {
      dispatch(deleteRoleRights({ id, user_id: currentUserId })).then(() => {
        showToast.success("Role Rights deleted successfully");
        dispatch(getAllRoleRights());
      });
    }
  };

  const areAllSelected =
    formData.permissions.length > 0 &&
    formData.permissions.every((p) => p.read && p.write && p.delete);
  const areAllReadSelected =
    formData.permissions.length > 0 &&
    formData.permissions.every((p) => p.read);
  const areAllWriteSelected =
    formData.permissions.length > 0 &&
    formData.permissions.every((p) => p.write);
  const areAllDeleteSelected =
    formData.permissions.length > 0 &&
    formData.permissions.every((p) => p.delete);

  return (
    <div className="">
      {/* ================= HEADER ================= */}
      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
      >
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-center">
              <h2 className="text-xl font-semibold text-gray-700 text-center">
                Role Rights Management
              </h2>
              <p className="text-sm text-blue-100">
                Configure page access permissions for user roles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleSubmit}>
            <div className=" flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-2">
                  {isEdit ? "Update Role Rights" : "Add Role Rights"}
                </h3>
              </div>
              <div className=" w-52">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Select Role --</option>
                  {allRolesList?.map((role) => (
                    <option key={role._id} value={role.role}>
                      {role.role}
                      {/* ({role.role_name}) */}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PERMISSIONS TABLE */}
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full min-w-[800px] text-sm text-left text-gray-700 border-collapse">
                {/* ================= HEADER ================= */}
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-gray-800">
                      Page / Module
                    </th>

                    {[
                      {
                        label: "Read",
                        key: "read",
                        checked: areAllReadSelected,
                      },
                      {
                        label: "Write",
                        key: "write",
                        checked: areAllWriteSelected,
                      },
                      {
                        label: "Delete",
                        key: "delete",
                        checked: areAllDeleteSelected,
                      },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-center font-semibold"
                      >
                        <div className="flex items-center justify-center gap-2">
                          {col.label}
                          <input
                            type="checkbox"
                            checked={col.checked}
                            onChange={(e) =>
                              handleColumnSelectAll(col.key, e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      </th>
                    ))}

                    <th className="px-4 py-3 text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        All
                        <input
                          type="checkbox"
                          checked={areAllSelected}
                          onChange={handleGlobalSelectAll}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {sidebarPages.map((section) => {
                    const isSectionAllChecked =
                      section.items.length > 0 &&
                      section.items.every((item) => {
                        const perm = formData.permissions.find(
                          (p) => p.page === item.label,
                        );
                        return perm && perm.read && perm.write && perm.delete;
                      });

                    return (
                      <React.Fragment key={section.section}>
                        {/* ===== Section Header ===== */}
                        <tr className="bg-gray-50 border-t border-b border-gray-200">
                          <td
                            colSpan={4}
                            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            {section.section}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isSectionAllChecked}
                              onChange={(e) =>
                                handleSectionSelectAll(
                                  section.section,
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        </tr>

                        {/* ===== Pages ===== */}
                        {section.items.map((item) => {
                          const perm = formData.permissions.find(
                            (p) => p.page === item.label,
                          ) || {
                            read: false,
                            write: false,
                            delete: false,
                          };

                          const isAllChecked =
                            perm.read && perm.write && perm.delete;

                          return (
                            <tr
                              key={item.label}
                              className="border-b border-gray-200 hover:bg-blue-50/40 transition"
                            >
                              <td className="px-5 py-2 font-medium text-gray-800">
                                {item.label}
                              </td>

                              {["read", "write", "delete"].map((type) => (
                                <td
                                  key={type}
                                  className="px-4 py-2 text-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={perm[type]}
                                    onChange={() =>
                                      handlePermissionChange(item.label, type)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>
                              ))}

                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={isAllChecked}
                                  onChange={(e) =>
                                    handleSelectAll(
                                      item.label,
                                      e.target.checked,
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 text-sm rounded text-white ${isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEdit
                    ? "Update Rights"
                    : "Save Rights"}
              </button>
            </div>
          </form>
        </div>

        {/* ================= LIST TABLE ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-2 border-b bg-gray-200 border-gray-200">
            <h3 className="text-base font-medium text-gray-800">
              Configured Role Rights
            </h3>
          </div>
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">S.No</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">
                  Permissions Configured
                </th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (!roleRightsList || roleRightsList.length === 0) ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : roleRightsList && roleRightsList.length > 0 ? (
                roleRightsList.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.role}</td>
                    <td className="px-4 py-3">
                      {item.permissions?.filter((p) => p.read).length} Pages
                      Accessible
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleRights;
