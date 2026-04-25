import React, { useState, useEffect } from 'react';
import { MdCloudUpload, MdEdit, MdDelete, MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroes, addHero, updateHero, deleteHero } from '../../features/website/heroSlice';
import { showToast } from '../../utlity/toastUtils';
const Hero = () => {
    const dispatch = useDispatch();
    const { heroes, actionLoading, loading, error } = useSelector((state) => state.hero || {});
    console.log("hero hero hero hero", heroes);

    // API response ko safely handle karne ke liye (kyunki kabhi-kabhi data nested object me aata hai jaise { data: [...] })
    let validHeroes = [];
    if (Array.isArray(heroes)) {
        validHeroes = heroes;
    } else if (heroes?.data && Array.isArray(heroes.data)) {
        validHeroes = heroes.data;
    } else if (heroes?.heroes && Array.isArray(heroes.heroes)) {
        validHeroes = heroes.heroes;
    } else if (heroes && typeof heroes === 'object' && heroes._id) {
        validHeroes = [heroes]; // Agar direct single object hai
    }

    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', subtitle: '', description: '', buttonName: '', buttonLink: '', image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil((validHeroes.length || 0) / itemsPerPage) || 1;

    useEffect(() => {
        dispatch(fetchHeroes());
    }, [dispatch]);

    // Error toast
    useEffect(() => {
        if (error) showToast.error(error);
    }, [error]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast.error('Only image files are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast.error('Image must be under 5MB');
            return;
        }
        setFormData(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({ title: '', subtitle: '', description: '', buttonName: '', buttonLink: '', image: null });
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            showToast.error('Title is required');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('description', formData.description);
        data.append('buttonName', formData.buttonName);
        data.append('buttonLink', formData.buttonLink);
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        if (editId) {
            const result = await dispatch(updateHero({ id: editId, formData: data }));
            if (updateHero.fulfilled.match(result)) {
                showToast.success('Hero updated successfully!');
                resetForm();
            }
        } else {
            const result = await dispatch(addHero(data));
            if (addHero.fulfilled.match(result)) {
                showToast.success('Hero added successfully!');
                resetForm();
            }
        }
    };

    const handleEdit = (hero) => {
        setEditId(hero._id);
        setFormData({
            title: hero.title || '',
            subtitle: hero.subtitle || '',
            description: hero.description || '',
            buttonName: hero.buttonName || '',
            buttonLink: hero.buttonLink || '',
            image: null
        });
        setImagePreview(hero.image?.url || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hero?')) return;
        const result = await dispatch(deleteHero(id));
        if (deleteHero.fulfilled.match(result)) {
            showToast.success('Hero deleted successfully!');
            // Agar current page pe koi item nahi bacha to previous page pe jao
            const remaining = validHeroes.length - 1;
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

    const currentHeroes = validHeroes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-4 p-1">
            {/* FORM SECTION */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-[#0C55A0] rounded-xl shadow-sm">
                        <MdEdit size={22} />
                    </div>
                    <div>
                        <h2 className="text-slate-200 font-medium text-xl tracking-tight">Hero Configuration</h2>
                        <p className="text-slate-200 text-sm font-medium mt-0.5">Update your website hero section details</p>
                    </div>
                </div>

                <form className="px-6 py-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {/* LEFT: TEXT INPUTS */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Main Title (H1) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter hero title"
                                        className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Subtitle</label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        placeholder="Enter hero subtitle"
                                        className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="2"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter short description"
                                    className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Button Name</label>
                                    <input
                                        type="text"
                                        name="buttonName"
                                        value={formData.buttonName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Get Started"
                                        className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Button Link</label>
                                    <input
                                        type="text"
                                        name="buttonLink"
                                        value={formData.buttonLink}
                                        onChange={handleInputChange}
                                        placeholder="e.g. /contact-us"
                                        className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: IMAGE UPLOAD */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Hero Visual Image <span className="text-red-500">*</span> <span className="text-slate-400 text-xs">(1440x600)</span></label>
                            <div className={`h-full min-h-[180px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 overflow-hidden relative
                                ${imagePreview ? 'border-transparent shadow-md' : 'border-slate-300 hover:border-[#0C55A0]/50 bg-slate-50 hover:bg-blue-50/30 cursor-pointer'}`}>
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-50 h-50 object-contain" />
                                        <div className="absolute inset-0 bg-[#0C55A0]/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                            <label className="bg-white p-4 rounded-2xl cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                                <MdCloudUpload className="text-[#0C55A0] text-3xl" />
                                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center w-full h-full justify-center cursor-pointer group/upload">
                                        <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-[#0C55A0] group-hover/upload:scale-110 group-hover/upload:bg-[#0C55A0] group-hover/upload:text-white transition-all duration-500 shadow-sm">
                                            <MdCloudUpload size={30} />
                                        </div>
                                        <div className="text-center mt-2">
                                            <p className="text-sm font-bold text-slate-700">Click to upload image</p>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">Recommended size: 1920x1080px</p>
                                        </div>
                                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className=" mt-2 pt-2 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="w-full sm:w-48">
                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:border-[#0C55A0] focus:ring-1 focus:ring-[#0C55A0]/10 transition-all outline-none text-sm font-normal text-slate-800 cursor-pointer"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex mt-10 items-center gap-6 w-full sm:w-auto">{/* Show Cancel button if editing or if form has any data */}
                            {(editId || formData.title || formData.subtitle || formData.description || formData.buttonName || formData.buttonLink || formData.image) && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full sm:w-auto px-6 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Cancel Edit
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full sm:w-auto px-8 py-2 bg-gradient-to-r from-[#F36B2A] to-[#e05a1d] text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {actionLoading ? 'Processing...' : editId ? 'Update Hero Content' : 'Add Hero Content'}
                            </button></div>
                    </div>
                </form>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-slate-200 font-medium text-lg tracking-tight">Hero Content Library</h2>
                        <p className="text-sm font-normal text-slate-200">Manage and organize your visual hero sections</p>
                    </div>
                    <span className="text-sm text-slate-200">{validHeroes.length} Record{validHeroes.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50">
                            <tr>
                                {['ID', 'Preview', 'Details', 'Button & Link', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border-b border-gray-100">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && validHeroes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500 text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-[#0C55A0] border-t-transparent rounded-full animate-spin" />
                                            Loading Data...
                                        </div>
                                    </td>
                                </tr>
                            ) : currentHeroes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500 text-sm">No records found</td>
                                </tr>
                            ) : currentHeroes.map((row, index) => (
                                <tr key={row._id} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}.</td>
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm border border-white">
                                            <img src={row.image?.url || 'https://placehold.co/64x48?text=No+Image'} alt="Hero" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-800 mb-1">{row.title}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{row.subtitle}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <span className="inline-block px-3 py-1 bg-[#F36B2A]/10 text-[#F36B2A] text-xs font-medium rounded-full">
                                                {row.buttonName || '—'}
                                            </span>
                                            <p className="text-xs text-blue-600 truncate max-w-[150px]">{row.buttonLink || '—'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {row.status || '—'}
                                        </span>

                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(row)}
                                                className="p-2.5 hover:bg-blue-500 hover:text-white rounded-xl text-[#0C55A0] transition-all shadow-sm bg-white border border-gray-100"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row._id)}
                                                disabled={actionLoading}
                                                className="p-2.5 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all shadow-sm bg-white border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
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
                <div className="px-8 py-8 border-t border-gray-50 bg-gray-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-gray-500">
                        Page <span className="text-gray-800 font-semibold">{currentPage}</span> of {totalPages}
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:text-[#0C55A0] hover:border-[#0C55A0]/30 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MdNavigateBefore size={18} /> Previous
                        </button>

                        <div className="flex items-center gap-1.5">
                            {getPageNumbers().map((num, idx) => (
                                <React.Fragment key={idx}>
                                    {num === '...' ? (
                                        <span className="px-2 text-gray-400 font-medium">...</span>
                                    ) : (
                                        <button
                                            onClick={() => typeof num === 'number' && setCurrentPage(num)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                                                ${currentPage === num
                                                    ? 'bg-[#0C55A0] text-white shadow-md'
                                                    : 'text-gray-400 hover:bg-white hover:text-[#0C55A0] border border-transparent hover:border-gray-100'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:text-[#0C55A0] hover:border-[#0C55A0]/30 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <MdNavigateNext size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;