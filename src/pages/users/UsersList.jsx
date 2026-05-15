import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../../features/superAdmin/userSlice";
import { useNavigate } from "react-router-dom";
import { MdPerson, MdEmail, MdPhone, MdEdit, MdDelete, MdNavigateNext, MdNavigateBefore, MdAdd } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { showToast } from "../../utlity/toastUtils";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
};

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [], loading, error } = useSelector((state) => state.users || {});

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) showToast.error(error);
  }, [error]);

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await dispatch(deleteUser(id));
      if (deleteUser.fulfilled.match(result)) {
        showToast.success("User deleted successfully");
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 2 || i >= totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="space-y-4 p-4">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users Management</h1>
          <p className="text-slate-500 text-sm">Manage administrative and staff accounts</p>
        </div>
        <button
          onClick={() => navigate("/addUser")}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0C55A0] text-white font-bold rounded-lg shadow-lg hover:bg-[#0a4685] transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <MdAdd size={20} /> Add New User
        </button>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-white font-medium text-lg">User Directory</h2>
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-white border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['#', 'User Details', 'Role', 'Contact', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-[#0C55A0] border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 italic">
                    No users found matching your search.
                  </td>
                </tr>
              ) : currentUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0C55A0] font-bold overflow-hidden shadow-sm border border-white">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0C55A0] text-[11px] font-bold uppercase tracking-tight">
                      {user.role?.roleName || user.role?.role || 'No Role'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MdPhone size={14} className="text-slate-400" /> {user.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MdEmail size={14} className="text-slate-400" /> {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[user.status] || "bg-slate-100 text-slate-600"}`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/addUser?editId=${user._id}`)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Edit User"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Delete User"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing page <span className="text-[#0C55A0]">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#0C55A0] disabled:opacity-50 transition-all shadow-sm"
              >
                <MdNavigateBefore size={20} />
              </button>
              <div className="flex gap-1 items-center">
                {getPageNumbers().map((num, i) => (
                  num === '...' ? (
                    <span key={i} className="px-2 text-slate-400 font-bold">...</span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(num)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all shadow-sm ${currentPage === num ? 'bg-[#0C55A0] text-white shadow-[#0C55A0]/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {num}
                    </button>
                  )
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#0C55A0] disabled:opacity-50 transition-all shadow-sm"
              >
                <MdNavigateNext size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;