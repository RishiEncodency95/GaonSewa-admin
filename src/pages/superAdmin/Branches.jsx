import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  clearBranches,
} from "../../features/superAdmin/branchSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdEdit,
  MdDelete,
  MdArrowBack,
  MdNavigateBefore,
  MdNavigateNext
} from "react-icons/md";
import { FiGitBranch, FiSearch, FiUsers } from "react-icons/fi";
import { showToast } from "../../utlity/toastUtils";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
};

const emptyForm = {
  name: "",
  isMainBranch: false,
  status: "Active",
  "address.street": "",
  "address.city": "",
  "address.state": "",
  "address.country": "",
  "address.pincode": "",
  email: "",
  phone: "",
  "workingHours.start": "",
  "workingHours.end": "",
};

export default function Branches() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const companyId = searchParams.get("companyId");
  const companyName = searchParams.get("companyName") || "Company";

  // Added actionLoading to differentiate between table fetching and form submitting
  const { branches: rawBranches = [], loading, actionLoading, error } = useSelector((state) => state.branch || {});

  let validBranches = [];
  // Bulletproof extraction for any nested API response format
  const extractData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.data?.branches && Array.isArray(data.data.branches)) return data.data.branches;
    if (data.branches && Array.isArray(data.branches)) return data.branches;
    if (data && typeof data === 'object' && data._id) return [data];
    return [];
  };
  validBranches = extractData(rawBranches);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (companyId) {
      dispatch(getBranches(companyId));
    }
    return () => dispatch(clearBranches());
  }, [companyId, dispatch]);

  useEffect(() => {
    if (error) showToast.error(error);
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const openEdit = (branch) => {
    setEditId(branch._id);
    setForm({
      name: branch.name || "",
      isMainBranch: branch.isMainBranch || false,
      status: branch.status || "Active",
      "address.street": branch.address?.street || branch.location?.address || "",
      "address.city": branch.address?.city || branch.location?.city || "",
      "address.state": branch.address?.state || branch.location?.state || "",
      "address.country": branch.address?.country || "",
      "address.pincode": branch.address?.pincode || "",
      email: branch.email || "",
      phone: branch.phone || "",
      "workingHours.start": branch.workingHours?.start || "",
      "workingHours.end": branch.workingHours?.end || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast.error("Branch Name is required");
      return;
    }

    const payload = {
      name: form.name,
      companyId,
      isMainBranch: form.isMainBranch,
      status: form.status,
      address: {
        street: form["address.street"],
        city: form["address.city"],
        state: form["address.state"],
        country: form["address.country"],
        pincode: form["address.pincode"],
      },
      email: form.email,
      phone: form.phone,
      workingHours: {
        start: form["workingHours.start"],
        end: form["workingHours.end"],
      },
    };

    try {
      if (editId) {
        const result = await dispatch(updateBranch({ id: editId, data: payload }));
        if (!result.error) {
          showToast.success("Branch updated successfully!");
          dispatch(getBranches(companyId)); // Force refresh table data
          resetForm();
        } else {
          showToast.error(result.payload || "Failed to update branch");
        }
      } else {
        const result = await dispatch(createBranch(payload));
        if (!result.error) {
          showToast.success("Branch added successfully!");
          dispatch(getBranches(companyId)); // Force refresh table data
          resetForm();
        } else {
          showToast.error(result.payload || "Failed to add branch");
        }
      }
    } catch (err) {
      showToast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch? All users under it might be affected.")) return;
    const result = await dispatch(deleteBranch(id));
    if (!result.error) {
      showToast.success("Branch deleted successfully!");
      dispatch(getBranches(companyId)); // Force refresh table data
      const remaining = filtered.length - 1;
      const newTotalPages = Math.ceil(remaining / itemsPerPage) || 1;
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    }
  };

  const filtered = validBranches.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil((filtered.length || 0) / itemsPerPage) || 1;
  const currentBranches = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    pages.push(1, 2);
    if (totalPages > 4) {
      let middlePage = currentPage;
      if (middlePage > 2 && middlePage < totalPages - 1) {
        pages.push('...', middlePage, '...');
      } else {
        pages.push('...', Math.floor(totalPages / 2), '...');
      }
      pages.push(totalPages - 1, totalPages);
    }
    return [...new Set(pages)].filter(p => p === '...' || (p > 0 && p <= totalPages));
  };

  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 bg-slate-50/50 rounded-3xl m-4 border border-slate-100">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-6">
          <FiGitBranch size={48} />
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">No Company Selected</h2>
        <p className="text-sm font-medium mb-6">Please select a company from the Companies page to manage its branches.</p>
        <button
          onClick={() => navigate("/companies")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all"
        >
          <MdArrowBack /> Go to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-1">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] rounded px-8 py-2 flex items-center justify-between">

        {/* LEFT: Back Button + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/companies")}
            className="p-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Back to Companies"
          >
            <MdArrowBack size={16} />
          </button>
          <h1 className="text-base font-medium text-white tracking-tight">
            Branch Management
          </h1>
        </div>

        {/* RIGHT: Company Name */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-200 font-medium uppercase tracking-wider">Company : </span>
          <span className="font-medium text-white text-sm px-3 py-1 bg-white/15 border border-white/20 rounded-lg">
            {decodeURIComponent(companyName)}
          </span>
        </div>

      </div>

      {/* ── Form ── */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-[#0C55A0] rounded-xl shadow-sm">
            <FiGitBranch size={22} />
          </div>
          <div>
            <h2 className="text-slate-200 font-medium text-xl tracking-tight">Branch Configuration</h2>
            <p className="text-slate-200 text-sm font-medium mt-0.5">Register or update branch offices</p>
          </div>
        </div>

        <form className="px-6 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Basic & Address */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Branch Name <span className="text-red-500">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. North Wing Branch"
                  className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="branch@company.com"
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9000000000"
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Street Address</label>
                <input type="text" name="address.street" value={form["address.street"]} onChange={handleChange} placeholder="123 Business Rd..."
                  className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
              </div>
            </div>

            {/* RIGHT COLUMN: Advanced Address & Hours */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">City</label>
                  <input type="text" name="address.city" value={form["address.city"]} onChange={handleChange} placeholder="City"
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">State</label>
                  <input type="text" name="address.state" value={form["address.state"]} onChange={handleChange} placeholder="State"
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Country</label>
                  <input type="text" name="address.country" value={form["address.country"]} onChange={handleChange} placeholder="Country"
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Pincode</label>
                  <input type="text" name="address.pincode" value={form["address.pincode"]} onChange={handleChange} placeholder="110001"
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Work Start</label>
                  <input type="time" name="workingHours.start" value={form["workingHours.start"]} onChange={handleChange}
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 cursor-pointer " />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Work End</label>
                  <input type="time" name="workingHours.end" value={form["workingHours.end"]} onChange={handleChange}
                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-slate-800 cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="isMainBranch" id="isMainBranch" checked={form.isMainBranch} onChange={handleChange} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-200 checked:right-0 checked:border-indigo-500 transition-all" />
                  <label htmlFor="isMainBranch" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${form.isMainBranch ? 'bg-indigo-500' : 'bg-slate-200'}`}></label>
                </div>
                <label htmlFor="isMainBranch" className="text-sm font-medium text-slate-700 cursor-pointer">Headquarters (Main)</label>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto">
              {(editId || form.name || form.email) && (
                <button type="button" onClick={resetForm} className="w-full sm:w-auto px-6 py-1.5 bg-slate-100 text-slate-700 font-medium text-sm rounded shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95">
                  Cancel Edit
                </button>
              )}
              <button type="submit" disabled={loading || actionLoading} className="w-full sm:w-auto px-8 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading || actionLoading ? 'Processing...' : editId ? 'Update Branch' : 'Register Branch'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Branches Table ── */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-slate-200 font-medium text-lg tracking-tight">Branches List</h2>
            <p className="text-sm font-normal text-slate-200">Manage {filtered.length} locations for {decodeURIComponent(companyName)}</p>
          </div>

          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full sm:w-72 pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                {['ID', 'Branch Info', 'Contact & Type', 'Location', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border-b border-gray-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && currentBranches.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      Loading Data...
                    </div>
                  </td>
                </tr>
              ) : currentBranches.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 text-sm">No records found</td>
                </tr>
              ) : currentBranches.map((row, index) => (
                <tr key={row._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}.
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                        {row.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-0.5">{row.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          {row.workingHours?.start && row.workingHours?.end ? `${row.workingHours.start} - ${row.workingHours.end}` : "Standard Hours"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">{row.email || '—'}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{row.phone || '—'}</span>
                        {row.isMainBranch && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">HQ</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">{row.address?.city || row.location?.city || '—'}</p>
                    <p className="text-xs text-slate-500">{row.address?.state || row.location?.state || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${STATUS_COLORS[row.status] || "bg-slate-100 text-slate-700"}`}>
                      {row.status || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/branch-users?branchId=${row._id}&branchName=${encodeURIComponent(row.name)}&companyId=${companyId}&companyName=${encodeURIComponent(companyName)}`)}
                        className="p-2.5 hover:bg-green-500 hover:text-white rounded-xl text-green-600 transition-all shadow-sm bg-white border border-gray-100" title="Manage Users">
                        <FiUsers size={18} />
                      </button>
                      <button onClick={() => openEdit(row)}
                        className="p-2.5 hover:bg-indigo-500 hover:text-white rounded-xl text-indigo-600 transition-all shadow-sm bg-white border border-gray-100" title="Edit">
                        <MdEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(row._id)} disabled={loading || actionLoading}
                        className="p-2.5 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all shadow-sm bg-white border border-gray-100 disabled:opacity-50" title="Delete">
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-500 font-medium">
              Page <span className="text-gray-800 font-bold">{currentPage}</span> of {totalPages}
            </p>

            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-600/30 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <MdNavigateBefore size={18} /> Previous
              </button>

              <div className="flex items-center gap-1.5 hidden sm:flex">
                {getPageNumbers().map((num, idx) => (
                  <React.Fragment key={idx}>
                    {num === '...' ? (
                      <span className="px-2 text-gray-400 font-medium">...</span>
                    ) : (
                      <button onClick={() => typeof num === 'number' && setCurrentPage(num)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                                          ${currentPage === num ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-gray-200'}`}>
                        {num}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-600/30 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Next <MdNavigateNext size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
