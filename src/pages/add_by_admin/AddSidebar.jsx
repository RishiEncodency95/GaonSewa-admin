import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdMenu, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSidebars, addSidebar, updateSidebar, deleteSidebar, clearError } from '../../features/add_by_admin/sidebarSlice';
import { showToast } from '../../utlity/toastUtils';

const AddSidebar = () => {
    const dispatch = useDispatch();
    const { sidebars = [], loading, actionLoading, error } = useSelector((state) => state.sidebars || {});

    const [search, setSearch] = useState("");
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        label: "", path: "", section: "", sectionOrder: 0, icon: "", parentMenu: "", status: "Active", order: 0
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({ label: "", path: "", section: "", sectionOrder: 0, icon: "", parentMenu: "", status: "Active", order: 0 });
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchSidebars());
    }, [dispatch]);

    useEffect(() => {
        if (error) showToast.error(error);
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.label.trim() || !formData.section.trim()) {
            showToast.error("Label and Section are required!");
            return;
        }

        let userName = "Admin";
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser && storedUser.name) {
                userName = storedUser.name;
            }
        } catch (err) {
            console.error("Error fetching user from local storage", err);
        }

        const payload = { ...formData };
        if (editId) {
            payload.updated_by = userName;
            const result = await dispatch(updateSidebar({ id: editId, data: payload }));
            if (updateSidebar.fulfilled.match(result)) {
                showToast.success("Sidebar item updated successfully!");
                resetForm();
            }
        } else {
            payload.added_by = userName;
            const result = await dispatch(addSidebar(payload));
            if (addSidebar.fulfilled.match(result)) {
                showToast.success("Sidebar item added successfully!");
                resetForm();
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setFormData({
            label: item.label || "", path: item.path || "", section: item.section || "",
            sectionOrder: item.sectionOrder || 0,
            icon: item.icon || "", parentMenu: item.parentMenu || "", status: item.status || "Active",
            order: item.order || 0
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {

        const result = await dispatch(deleteSidebar(id));
        if (deleteSidebar.fulfilled.match(result)) {
            showToast.success("Sidebar item deleted successfully!");
            if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
        }
    };

    const filteredItems = sidebars.filter(s =>
        s.label?.toLowerCase().includes(search.toLowerCase()) ||
        s.section?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-4 p-1">
            {/* ── Form ── */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-[#0C55A0] rounded-xl shadow-sm">
                        <MdMenu size={22} />
                    </div>
                    <div>
                        <h2 className="text-slate-200 font-medium text-xl tracking-tight">Sidebar Configuration</h2>
                        <p className="text-slate-200 text-sm font-medium mt-0.5">Add or update navigation menu items</p>
                    </div>
                </div>

                <form className="px-6 py-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Label */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Label <span className="text-red-500">*</span></label>
                            <input type="text" name="label" value={formData.label} onChange={handleInputChange} placeholder="e.g. Dashboard"
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                        </div>

                        {/* Path */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Path</label>
                            <input name="path" value={formData.path} onChange={handleInputChange} placeholder="e.g. /dashboard"
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                        </div>

                        {/* Section */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Section <span className="text-red-500">*</span></label>
                            <input name="section" value={formData.section} onChange={handleInputChange} placeholder="e.g. MAIN, SUPER ADMIN"
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                        </div>
                        {/* Section Order */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Section Order <span className="text-red-500">*</span></label>
                            <input type="number" name="sectionOrder" value={formData.sectionOrder} onChange={handleInputChange} placeholder="e.g. 1"
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                        </div>


                        {/* Icon Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Icon</label>
                            <select name="icon" value={formData.icon} onChange={handleInputChange} className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800 cursor-pointer">
                                <option value="">Select Icon</option>
                                <option value="MdDashboard">MdDashboard</option>
                                <option value="MdPeople">MdPeople</option>
                                <option value="FiSettings">FiSettings</option>
                                <option value="FiLayers">FiLayers</option>
                            </select>
                        </div>

                        {/* Parent Menu Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Parent Menu (Optional)</label>
                            <select name="parentMenu" value={formData.parentMenu} onChange={handleInputChange} className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800 cursor-pointer">
                                <option value="">None (Root Level)</option>
                                {[...new Set(sidebars
                                    .filter(item => !item.parentMenu || item.parentMenu === "" || item.parentMenu === "None")
                                    .map(item => item.label)
                                )].map(label => (
                                    <option key={label} value={label}>{label}</option>
                                ))}
                            </select>
                        </div>
                        {/* Order By  */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Order By <span className="text-red-500">*</span></label>
                            <input type="number" name="order" value={formData.order} onChange={handleInputChange} placeholder="e.g. 1"
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-slate-800 cursor-pointer">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 flex flex-col sm:flex-row items-center justify-end gap-6">
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            {(editId || formData.label || formData.path || formData.section) && (
                                <button type="button" onClick={resetForm} className="w-full sm:w-auto px-6 py-1.5 bg-slate-100 text-slate-700 font-medium text-sm rounded shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95">
                                    Clear Form
                                </button>
                            )}
                            <button type="submit" disabled={actionLoading} className="w-full sm:w-auto px-8 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {actionLoading ? 'Processing...' : editId ? 'Update Menu Item' : 'Add Menu Item'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-slate-200 font-medium text-lg tracking-tight">Sidebar Items List</h2>
                        <p className="text-sm font-normal text-slate-200">Manage all registered navigation items</p>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by label..."
                            className="w-full sm:w-72 pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50">
                            <tr>
                                {['Label', 'Path', 'Section', 'Order', 'Sec. Order', 'Parent Menu', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border-b border-slate-100">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-sm text-gray-500">Loading Menu Items...</td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                                                    {item.label?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 mb-0.5">{item.label}</p>
                                                    <p className="text-xs text-gray-500 font-medium">Icon: {item.icon || 'None'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-700">{item.path || '—'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-700">{item.section}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <p className="text-sm font-bold text-[#0C55A0] bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg mx-auto">{item.order || 0}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <p className="text-sm font-bold text-purple-600 bg-purple-50 w-8 h-8 flex items-center justify-center rounded-lg mx-auto">{item.sectionOrder || 0}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.parentMenu || 'None'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2.5 hover:bg-indigo-500 hover:text-white rounded-xl text-indigo-600 transition-all shadow-sm bg-white border border-gray-100" title="Edit">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} disabled={actionLoading} className="p-2.5 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all shadow-sm bg-white border border-gray-100 disabled:opacity-50" title="Delete">
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-sm text-gray-500">No menu items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-gray-500">
                            Page <span className="text-gray-800 font-semibold">{currentPage}</span> of {totalPages}
                        </p>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:text-[#0C55A0] hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <MdNavigateBefore size={18} /> Previous
                            </button>
                            <div className="flex items-center gap-1.5">
                                <span className="px-4 py-2 rounded-xl bg-[#0C55A0] text-white shadow-md text-sm font-medium">{currentPage}</span>
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:text-[#0C55A0] hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                Next <MdNavigateNext size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddSidebar;