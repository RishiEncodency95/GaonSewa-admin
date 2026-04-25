import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../../features/superAdmin/companySlice";
import { useNavigate } from "react-router-dom";
import { MdBusiness, MdCloudUpload, MdEdit, MdDelete, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FiSearch, FiGitBranch } from "react-icons/fi";
import { showToast } from "../../utlity/toastUtils";

const PLAN_COLORS = {
  basic: "bg-slate-100 text-slate-600",
  pro: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Suspended: "bg-red-100 text-red-700",
  Inactive: "bg-yellow-100 text-yellow-700",
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  website: "",
  "address.street": "",
  "address.city": "",
  "address.state": "",
  "address.country": "",
  "address.pincode": "",
  gstNumber: "",
  panNumber: "",
  category: "",
  businessNature: "",
  "settings.allowCredit": true,
  "settings.currency": "INR",
  plan: "Free",
  description: "",
  status: "Active",
  logo: null
};

export default function Companies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies = [], loading, error } = useSelector((state) => state.company || {});

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoPreview, setLogoPreview] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // API response ko safely handle karne ke liye (Agar API nested object ya single data return kare)
  let validCompanies = [];
  if (Array.isArray(companies)) {
    validCompanies = companies;
  } else if (companies?.data && Array.isArray(companies.data)) {
    validCompanies = companies.data;
  } else if (companies?.companies && Array.isArray(companies.companies)) {
    validCompanies = companies.companies;
  } else if (companies && typeof companies === 'object' && companies._id) {
    validCompanies = [companies];
  }

  // Filter data before pagination
  const filteredCompanies = validCompanies.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil((filteredCompanies.length || 0) / itemsPerPage) || 1;
  const currentCompanies = filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (error) showToast.error(error);
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast.error('Only image files are allowed');
      return;
    }
    setForm(prev => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setEditId(null);
    setForm(emptyForm);
    setLogoPreview(null);
  };

  const openEdit = (company) => {
    setEditId(company._id);
    setForm({
      name: company.name || "",
      email: company.email || "",
      phone: company.phone || "",
      website: company.website || "",
      "address.street": company.address?.street || "",
      "address.city": company.address?.city || "",
      "address.state": company.address?.state || "",
      "address.country": company.address?.country || "",
      "address.pincode": company.address?.pincode || "",
      gstNumber: company.gstNumber || "",
      panNumber: company.panNumber || "",
      category: company.category || "",
      businessNature: company.businessNature || "",
      "settings.allowCredit": company.settings?.allowCredit ?? true,
      "settings.currency": company.settings?.currency || "INR",
      plan: company.plan || "Free",
      description: company.description || "",
      status: company.status || "Active",
      logo: null
    });
    setLogoPreview(company.logo?.url || company.logo || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast.error('Company Name is required');
      return;
    }

    // const formData = new FormData();
    // Object.keys(form).forEach(key => {
    //   if (key === 'logo') {
    //     if (form.logo instanceof File) formData.append('logo', form.logo);
    //   } else if (typeof form[key] === "boolean") {
    //     formData.append(key, form[key]);
    //   } else if (form[key]) {
    //     formData.append(key, form[key]);
    //   }
    // });

    const formData = new FormData();

    // simple fields
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("website", form.website);
    formData.append("gstNumber", form.gstNumber);
    formData.append("panNumber", form.panNumber);
    formData.append("category", form.category);
    formData.append("businessNature", form.businessNature);
    formData.append("plan", form.plan);
    formData.append("description", form.description);
    formData.append("status", form.status);

    // 🔥 address JSON
    formData.append("address", JSON.stringify({
      street: form["address.street"],
      city: form["address.city"],
      state: form["address.state"],
      country: form["address.country"],
      pincode: form["address.pincode"]
    }));

    // 🔥 settings JSON
    formData.append("settings", JSON.stringify({
      allowCredit: form["settings.allowCredit"],
      currency: form["settings.currency"]
    }));

    // 🔥 logo file
    if (form.logo instanceof File) {
      formData.append("logo", form.logo);
    }



    if (editId) {
      const result = await dispatch(updateCompany({ id: editId, data: formData }));
      if (updateCompany.fulfilled.match(result)) {
        showToast.success('Company updated successfully!');
        resetForm();
      }
    } else {
      const result = await dispatch(createCompany(formData));
      if (createCompany.fulfilled.match(result)) {
        showToast.success('Company added successfully!');
        resetForm();
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company? All branches will be affected.')) return;
    const result = await dispatch(deleteCompany(id));
    if (deleteCompany.fulfilled.match(result)) {
      showToast.success('Company deleted successfully!');
      const remaining = filteredCompanies.length - 1;
      const newTotalPages = Math.ceil(remaining / itemsPerPage) || 1;
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    }
  };

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

  return (
    <div className="space-y-8 p-1">

      {/* ── FORM SECTION ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-[#0C55A0] rounded-xl shadow-sm">
            <MdBusiness size={22} />
          </div>
          <div>
            <h2 className="text-slate-800 font-extrabold text-xl tracking-tight">Company Configuration</h2>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Register or update business profiles</p>
          </div>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

            {/* LEFT: INPUTS */}
            <div className="xl:col-span-2 space-y-6">

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Company Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Gaon Fresh"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Business Nature</label>
                  <input type="text" name="businessNature" value={form.businessNature} onChange={handleChange} placeholder="e.g. Manufacturer, Retail"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="contact@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9000000000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Website</label>
                  <input type="text" name="website" value={form.website} onChange={handleChange} placeholder="www.domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Street Address</label>
                  <input type="text" name="address.street" value={form["address.street"]} onChange={handleChange} placeholder="123 Main St..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">City</label>
                  <input type="text" name="address.city" value={form["address.city"]} onChange={handleChange} placeholder="City"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">State</label>
                  <input type="text" name="address.state" value={form["address.state"]} onChange={handleChange} placeholder="State"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Pincode</label>
                  <input type="text" name="address.pincode" value={form["address.pincode"]} onChange={handleChange} placeholder="110001"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800" />
                </div>
              </div>

              {/* Legal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">GST Number</label>
                  <input type="text" name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="GSTIN"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800 uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">PAN Number</label>
                  <input type="text" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="PAN"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800 uppercase" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Description</label>
                <textarea name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Brief details about the company..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800 resize-none" />
              </div>
            </div>

            {/* RIGHT: LOGO UPLOAD & SETTINGS */}
            <div className="xl:col-span-1 space-y-6">
              <div className="relative group h-64">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Company Logo</label>
                <div className={`h-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 overflow-hidden relative
                          ${logoPreview ? 'border-transparent shadow-md' : 'border-slate-300 hover:border-[#0C55A0]/50 bg-slate-50 hover:bg-blue-50/30 cursor-pointer'}`}>
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-4" />
                      <div className="absolute inset-0 bg-[#0C55A0]/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <label className="bg-white p-4 rounded-2xl cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-all">
                          <MdCloudUpload className="text-[#0C55A0] text-3xl" />
                          <input type="file" onChange={handleLogoChange} className="hidden" accept="image/*" />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center w-full h-full justify-center cursor-pointer group/upload">
                      <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-[#0C55A0] group-hover/upload:scale-110 group-hover/upload:bg-[#0C55A0] group-hover/upload:text-white transition-all duration-500 shadow-sm">
                        <MdCloudUpload size={36} />
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-sm font-bold text-slate-700">Upload Logo</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">PNG, JPG, up to 5MB</p>
                      </div>
                      <input type="file" onChange={handleLogoChange} className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">SaaS Plan</label>
                  <select name="plan" value={form.plan} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800 cursor-pointer">
                    <option value="Free">Free Plan</option>
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro Plan</option>
                  </select>
                </div>
                <div className="flex items-center justify-between px-2">
                  <label className="text-sm font-bold text-slate-700 cursor-pointer" htmlFor="allowCredit">Allow Credit Mode</label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="settings.allowCredit" id="allowCredit" checked={form["settings.allowCredit"]} onChange={handleChange} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-200 checked:right-0 checked:border-green-500 transition-all" />
                    <label htmlFor="allowCredit" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${form["settings.allowCredit"] ? 'bg-green-500' : 'bg-slate-200'}`}></label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-full sm:w-48">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium text-slate-800 cursor-pointer">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {(editId || form.name || form.email || logoPreview) && (
                <button type="button" onClick={resetForm} className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-all active:scale-95">
                  Cancel
                </button>
              )}
              <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#F36B2A] to-[#e05a1d] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : editId ? 'Update Company' : 'Register Company'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Companies Table ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-4">
          <div>
            <h2 className="text-slate-800 font-extrabold text-lg tracking-tight">Registered Companies</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Manage {filteredCompanies.length} Business Accounts</p>
          </div>

          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                {['ID', 'Company Details', 'Contact Info', 'Plan', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border-b border-gray-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && currentCompanies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#0C55A0] border-t-transparent rounded-full animate-spin" />
                      Loading Data...
                    </div>
                  </td>
                </tr>
              ) : currentCompanies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 text-sm">No records found</td>
                </tr>
              ) : currentCompanies.map((row, index) => (
                <tr key={row._id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}.
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {row.logo ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-white bg-slate-50 flex-shrink-0">
                          <img src={row.logo?.url || row.logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm border border-white flex-shrink-0">
                          {row.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-0.5">{row.name}</p>
                        <p className="text-xs font-medium text-gray-500">{row.category || "General"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-slate-700">{row.email || '—'}</p>
                      <p className="text-xs text-slate-500">{row.phone || '—'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${PLAN_COLORS[row.plan?.toLowerCase()] || "bg-slate-100 text-slate-600"}`}>
                      {row.plan || "Free"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${STATUS_COLORS[row.status] || "bg-slate-100 text-slate-700"}`}>
                      {row.status || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/branches?companyId=${row._id}&companyName=${encodeURIComponent(row.name)}`)}
                        className="p-2.5 hover:bg-indigo-500 hover:text-white rounded-xl text-indigo-600 transition-all shadow-sm bg-white border border-gray-100" title="Manage Branches">
                        <FiGitBranch size={18} />
                      </button>
                      <button onClick={() => openEdit(row)}
                        className="p-2.5 hover:bg-blue-500 hover:text-white rounded-xl text-[#0C55A0] transition-all shadow-sm bg-white border border-gray-100" title="Edit">
                        <MdEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(row._id)} disabled={loading}
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:text-[#0C55A0] hover:border-[#0C55A0]/30 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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
                                          ${currentPage === num ? 'bg-[#0C55A0] text-white shadow-md' : 'text-gray-500 hover:bg-white hover:text-[#0C55A0] border border-transparent hover:border-gray-200'}`}>
                        {num}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:text-[#0C55A0] hover:border-[#0C55A0]/30 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Next <MdNavigateNext size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
