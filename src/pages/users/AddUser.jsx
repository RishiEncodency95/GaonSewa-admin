import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser, fetchAllUsers } from "../../features/superAdmin/userSlice";
import { fetchRoles } from "../../features/add_by_admin/roleSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { MdPerson, MdCloudUpload, MdArrowBack, MdSave, MdCancel } from "react-icons/md";
import { showToast } from "../../utlity/toastUtils";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  profileImage: null,
  street: "",
  city: "",
  state: "",
  pincode: "",
  role: "",
  status: "Active",
};

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("editId");

  const { users = [], loading } = useSelector((state) => state.users || {});
  const { roles = [] } = useSelector((state) => state.roles || {});

  const [form, setForm] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchRoles());
    if (editId) {
      const userToEdit = users.find((u) => u._id === editId);
      if (userToEdit) {
        setForm({
          name: userToEdit.name || "",
          email: userToEdit.email || "",
          password: "", // Don't pre-fill password for security
          phone: userToEdit.phone || "",
          gender: userToEdit.gender || "",
          dateOfBirth: userToEdit.dateOfBirth ? new Date(userToEdit.dateOfBirth).toISOString().split('T')[0] : "",
          profileImage: null,
          street: userToEdit.address?.street || "",
          city: userToEdit.address?.city || "",
          state: userToEdit.address?.state || "",
          pincode: userToEdit.address?.pincode || "",
          role: userToEdit.role?._id || userToEdit.role || "",
          status: userToEdit.status || "Active",
        });
        if (userToEdit.profileImage) {
          setImagePreview(userToEdit.profileImage);
        }
      } else {
        dispatch(fetchAllUsers()); // Fetch users if not already in state
      }
    }
  }, [editId, users, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast.error("Only image files are allowed");
        return;
      }
      setForm((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || (!editId && !form.password) || !form.role) {
      showToast.error("Please fill in all required fields (*)");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    
    // Address object for backend
    const address = {
      street: form.street,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    };

    formData.append("name", form.name);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("dateOfBirth", form.dateOfBirth);
    formData.append("address", JSON.stringify(address));
    formData.append("role", form.role);
    formData.append("status", form.status);

    if (form.profileImage) {
      formData.append("profileImage", form.profileImage);
    }

    try {
      if (editId) {
        await dispatch(updateUser({ id: editId, data: formData })).unwrap();
        showToast.success("User updated successfully");
      } else {
        await dispatch(createUser(formData)).unwrap();
        showToast.success("User created successfully");
      }
      navigate("/usersList");
    } catch (error) {
      showToast.error(error || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/usersList")}
          className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <MdArrowBack size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{editId ? "Edit User Profile" : "Register New User"}</h1>
          <p className="text-slate-500 text-sm">Fill in the details to {editId ? "update the" : "create a new"} account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-3">
          <h2 className="text-white font-medium flex items-center gap-2 italic">
            <MdPerson size={20} /> User Information
          </h2>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
            
            {/* ── Profile Image Column ── */}
            <div className="xl:col-span-1 flex flex-col items-center gap-4">
              <div className="relative group w-48 h-48">
                <div className={`w-full h-full rounded-[2.5rem] border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                  ${imagePreview ? 'border-transparent shadow-2xl' : 'border-slate-200 bg-slate-50 hover:border-[#0C55A0]/30 hover:bg-blue-50/20'}`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <MdCloudUpload size={48} />
                      <span className="text-xs font-bold uppercase mt-2">Upload Photo</span>
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 cursor-pointer rounded-[2.5rem]">
                  <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                  <div className="absolute inset-0 bg-[#0C55A0]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                       <MdCloudUpload size={24} className="text-[#0C55A0]" />
                    </div>
                  </div>
                </label>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Max Size: 2MB | Formats: JPG, PNG
              </p>
            </div>

            {/* ── Form Fields Column ── */}
            <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password {!editId && <span className="text-red-500">*</span>}</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={editId ? "Leave blank to keep current" : "••••••••"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-medium"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] transition-all outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] transition-all outline-none text-sm font-medium"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Account Role <span className="text-red-500">*</span></label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#0C55A0]/20 bg-blue-50/30 focus:bg-white focus:border-[#0C55A0] transition-all outline-none text-sm font-bold text-[#0C55A0] cursor-pointer"
                >
                  <option value="">Choose Role</option>
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>{r.roleName || r.role}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Account Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] transition-all outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* ── Address Fields ── */}
              <div className="md:col-span-2 mt-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                   Location Details
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                       <input type="text" name="street" value={form.street} onChange={handleChange} placeholder="Street Address" 
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] transition-all outline-none text-sm font-medium" />
                    </div>
                    <div>
                       <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" 
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] transition-all outline-none text-sm font-medium" />
                    </div>
                    <div>
                       <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" 
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0C55A0] transition-all outline-none text-sm font-medium" />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
             <button
               type="button"
               onClick={() => navigate("/usersList")}
               className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
             >
               <MdCancel size={18} /> Cancel
             </button>
             <button
               type="submit"
               disabled={isSubmitting}
               className="flex items-center gap-2 px-10 py-2.5 bg-gradient-to-r from-[#F36B2A] to-[#e05a1d] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70"
             >
               {isSubmitting ? "Processing..." : editId ? <><MdSave size={18} /> Update User</> : <><MdSave size={18} /> Create User</>}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUser;