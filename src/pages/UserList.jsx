import React, { useState, useEffect } from "react";
import { MdPeopleOutline, MdRefresh, MdOutlineError, MdEdit, MdDeleteOutline } from "react-icons/md";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Apni backend API ka actual URL yahan daalein
    // Example: "http://localhost:5000/api/users"
    const API_URL = "http://localhost:5000/api/users";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(API_URL, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data.users || data || []);
            setLoading(false);
        } catch (err) {
            console.log("API Fetch failed, using dummy data. Error:", err.message);
            setUsers([
                { _id: "1", name: "Rahul Sharma", email: "rahul@example.com", role: "Admin", status: "Active" },
                { _id: "2", name: "Priya Singh", email: "priya@example.com", role: "User", status: "Inactive" },
                { _id: "3", name: "Amit Kumar", email: "amit@example.com", role: "Editor", status: "Active" }
            ]);
            setError("Backend API is unreachable. Displaying dummy data for preview.");
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                            <MdPeopleOutline size={24} />
                        </div>
                        User Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        View and manage system users, roles, and their statuses.
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    <MdRefresh size={18} className={loading ? "animate-spin text-indigo-600" : "text-indigo-600"} />
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* ERROR BANNER */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <MdOutlineError className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-red-800">Connection Error</h3>
                        <p className="text-xs font-medium text-red-600 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                            <p className="text-sm font-medium text-slate-400">Loading user data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                                                    {user.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm mb-0.5">{user.name}</div>
                                                    <div className="text-xs font-medium text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                                                {user.role || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border
                                                ${user.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    : 'bg-red-50 text-red-600 border-red-200'
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                                {user.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-colors shadow-sm" title="Edit User">
                                                    <MdEdit size={16} />
                                                </button>
                                                <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors shadow-sm" title="Delete User">
                                                    <MdDeleteOutline size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                                            <MdPeopleOutline size={48} className="opacity-20" />
                                            <p className="text-sm font-medium">No users found in the database.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}