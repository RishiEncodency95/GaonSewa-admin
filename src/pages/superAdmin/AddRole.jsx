import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdSecurity, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, addRole, updateRole, deleteRole, clearError } from '../../features/add_by_admin/roleSlice';
import { showToast } from '../../utlity/toastUtils';

const AddRole = () => {
    const dispatch = useDispatch();
    const { roles = [], loading, actionLoading, error } = useSelector((state) => state.roles || {});
    console.log("roles", roles);

    const [search, setSearch] = useState("");
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        role: "",
        roleName: "",
        status: "Active"
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showToast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({ role: "", roleName: "", status: "Active" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.role.trim() || !formData.roleName.trim()) {
            showToast.error("Role and Role Name are required!");
            return;
        }

        // Fetch user from localStorage to log added_by / updated_by
        let userName = "Admin";
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser && storedUser.name) {
                userName = storedUser.name;
            }
        } catch (err) {
            console.error("Error fetching user from local storage", err);
        }

        if (editId) {
            const result = await dispatch(updateRole({ id: editId, data: { ...formData, updated_by: userName } }));
            if (updateRole.fulfilled.match(result)) {
                showToast.success("Role updated successfully!");
                resetForm();
            }
        } else {
            const result = await dispatch(addRole({ ...formData, added_by: userName }));
            if (addRole.fulfilled.match(result)) {
                showToast.success("Role added successfully!");
                resetForm();
            }
        }
    };

    const handleEdit = (roleItem) => {
        setEditId(roleItem._id);
        setFormData({ role: roleItem.role, roleName: roleItem.roleName, status: roleItem.status });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {

        const result = await dispatch(deleteRole(id));
        if (deleteRole.fulfilled.match(result)) {
            showToast.success("Role deleted successfully!");
            if (currentRoles.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
        }
    };

    // Search & Pagination calculations
    const filteredRoles = roles.filter(r =>
        r.role?.toLowerCase().includes(search.toLowerCase()) ||
        r.roleName?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage) || 1;
    const currentRoles = filteredRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-4 p-1">
            {/* ── Form ── */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-[#0C55A0] rounded-xl shadow-sm">
                        <MdSecurity size={22} />
                    </div>
                    <div>
                        <h2 className="text-slate-200 font-medium text-xl tracking-tight">Role Configuration</h2>
                        <p className="text-slate-200 text-sm font-medium mt-0.5">Register or update user roles</p>
                    </div>
                </div>

                <form className="px-6 py-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Role</label>
                            <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g. Admin, User, Manager"
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Role Name <span className="text-red-500">*</span></label>
                            <input name="roleName" value={formData.roleName} onChange={handleInputChange} placeholder="Enter role name (e.g. Administrator)"
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-slate-800 cursor-pointer">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-6">
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            {(editId || formData.role || formData.roleName) && (
                                <button type="button" onClick={resetForm} className="w-full sm:w-auto px-6 py-1.5 bg-slate-100 text-slate-700 font-medium text-sm rounded shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95">
                                    Cancel
                                </button>
                            )}
                            <button type="submit" disabled={actionLoading} className="w-full sm:w-auto px-8 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {actionLoading ? "Processing..." : editId ? "Update Role" : "Register Role"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-slate-200 font-medium text-lg tracking-tight">Roles List</h2>
                        <p className="text-sm font-normal text-slate-200">Manage all registered roles</p>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full sm:w-72 pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50">
                            <tr>
                                {['ID', 'Role', 'Role Name', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border-b border-slate-100">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-sm text-gray-500">Loading Roles...</td>
                                </tr>
                            ) : currentRoles.length > 0 ? (
                                currentRoles.map((roleItem, index) => (
                                    <tr key={roleItem._id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(currentPage - 1) * itemsPerPage + index + 1}.
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                                                    {roleItem.role?.charAt(0).toUpperCase() || 'R'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 mb-0.5">{roleItem.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-700">{roleItem.roleName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${roleItem.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {roleItem.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEdit(roleItem)} className="p-2.5 hover:bg-indigo-500 hover:text-white rounded-xl text-indigo-600 transition-all shadow-sm bg-white border border-gray-100" title="Edit">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(roleItem._id)} disabled={actionLoading} className="p-2.5 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all shadow-sm bg-white border border-gray-100 disabled:opacity-50" title="Delete">
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-sm text-gray-500">No roles found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                <div className="px-8 py-8 border-t border-gray-50 bg-gray-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
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
            </div>
        </div>
    )
}

export default AddRole