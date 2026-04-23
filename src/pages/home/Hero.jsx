import React, { useState } from 'react';
import { MdCloudUpload, MdEdit, MdDelete, MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

const Hero = () => {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        buttonName: '',
        buttonLink: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 100; // Hardcoded for demo as requested (showing 1,2...middle...99,100)

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Dummy data for table
    const tableData = [
        { id: 1, title: 'Welcome to Namo Gange', subtitle: 'Spiritual Journey', description: 'Experience the holy Ganges.', buttonName: 'Explore Now', buttonLink: '/explore', image: 'https://via.placeholder.com/50' },
        { id: 2, title: 'Clean Ganga Mission', subtitle: 'Environmental', description: 'Help us clean the river.', buttonName: 'Donate Now', buttonLink: '/donate', image: 'https://via.placeholder.com/50' },
        { id: 3, title: 'Spiritual Retreat', subtitle: 'Wellness', description: 'Peace and tranquility.', buttonName: 'Book Now', buttonLink: '/book', image: 'https://via.placeholder.com/50' },
        { id: 4, title: 'Ganga Aarti', subtitle: 'Event', description: 'Daily schedule and times.', buttonName: 'View Times', buttonLink: '/aarti', image: 'https://via.placeholder.com/50' },
        { id: 5, title: 'Volunteer', subtitle: 'Community', description: 'Join our team.', buttonName: 'Join Now', buttonLink: '/volunteer', image: 'https://via.placeholder.com/50' },
    ];

    // Pagination Helper to get page numbers
    const getPageNumbers = () => {
        const pages = [];
        // Starting 1, 2
        pages.push(1, 2);

        // Middle 1 number (e.g., current page if it's not 1, 2, 99, 100)
        let middlePage = currentPage;
        if (middlePage <= 2) middlePage = 10; // Default middle if at start
        if (middlePage >= 99) middlePage = 10; // Default middle if at end
        
        if (middlePage > 2 && middlePage < 99) {
            pages.push('...', middlePage, '...');
        } else {
            pages.push('...', middlePage, '...');
        }

        // Last 2 number 99, 100
        pages.push(99, 100);
        
        return pages;
    };

    return (
        <div className="space-y-8 p-1">
            {/* FORM SECTION */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C55A0] to-[#0a4685] px-8 py-5">
                    <h2 className="text-white font-extrabold text-xl tracking-tight">Hero Section Configuration</h2>
                    <p className="text-blue-100 text-xs font-medium mt-1 uppercase tracking-widest">Update your website hero section details</p>
                </div>
                
                <form className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {/* LEFT: TEXT INPUTS */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Main Title</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter hero title"
                                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/5 transition-all outline-none text-sm font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Subtitle</label>
                                    <input 
                                        type="text" 
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        placeholder="Enter hero subtitle"
                                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/5 transition-all outline-none text-sm font-medium placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Description</label>
                                <textarea 
                                    name="description"
                                    rows="2"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter short description"
                                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/5 transition-all outline-none text-sm font-medium placeholder:text-gray-300 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Button Name</label>
                                    <input 
                                        type="text" 
                                        name="buttonName"
                                        value={formData.buttonName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Get Started"
                                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/5 transition-all outline-none text-sm font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Button Link</label>
                                    <input 
                                        type="text" 
                                        name="buttonLink"
                                        value={formData.buttonLink}
                                        onChange={handleInputChange}
                                        placeholder="e.g. /contact-us"
                                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#0C55A0] focus:ring-4 focus:ring-[#0C55A0]/5 transition-all outline-none text-sm font-medium placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: IMAGE UPLOAD */}
                        <div className="relative group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Hero Visual Image</label>
                            <div className={`h-[285px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden relative
                                ${imagePreview ? 'border-transparent' : 'border-gray-200 hover:border-[#0C55A0]/30 hover:bg-blue-50/30'}`}>
                                
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-[#0C55A0]/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                            <label className="bg-white p-4 rounded-2xl cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                                <MdCloudUpload className="text-[#0C55A0] text-3xl" />
                                                <input type="file" onChange={handleImageChange} className="hidden" />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer group/upload">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-[#0C55A0] group-hover/upload:scale-110 group-hover/upload:bg-[#0C55A0] group-hover/upload:text-white transition-all duration-500 shadow-sm">
                                            <MdCloudUpload size={36} />
                                        </div>
                                        <div className="text-center mt-4">
                                            <p className="text-sm font-extrabold text-gray-800">Drop your image here</p>
                                            <p className="text-xs text-gray-400 mt-1">Recommended size: 1920x1080px</p>
                                        </div>
                                        <input type="file" onChange={handleImageChange} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                        <button type="button" className="px-12 py-4 bg-[#F36B2A] text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-100 hover:bg-[#e05a1d] hover:shadow-orange-200 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest">
                            Update Hero Content
                        </button>
                    </div>
                </form>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h2 className="text-gray-800 font-extrabold text-lg tracking-tight">Hero Content Library</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Manage and organize your visual hero sections</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50">
                            <tr>
                                {['ID', 'Preview', 'Details', 'Button & Link', 'Actions'].map((h) => (
                                    <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tableData.map((row) => (
                                <tr key={row.id} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-8 py-6 text-xs font-black text-gray-300 italic">#{row.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm border border-white">
                                            <img src={row.image} alt="Hero" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-gray-800 leading-tight mb-1">{row.title}</p>
                                        <p className="text-[10px] text-gray-400 font-bold italic line-clamp-1">{row.subtitle}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <span className="inline-block px-3 py-1 bg-[#F36B2A]/5 text-[#F36B2A] text-[10px] font-black rounded-full border border-[#F36B2A]/10 uppercase tracking-widest">
                                                {row.buttonName}
                                            </span>
                                            <p className="text-[10px] text-blue-500 font-bold lowercase truncate max-w-[100px]">{row.buttonLink}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2.5 hover:bg-blue-500 hover:text-white rounded-xl text-[#0C55A0] transition-all shadow-sm bg-white border border-gray-100">
                                                <MdEdit size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all shadow-sm bg-white border border-gray-100">
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
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Page <span className="text-gray-800 font-black">{currentPage}</span> of {totalPages}</p>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#0C55A0] hover:border-[#0C55A0]/20 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MdNavigateBefore size={18} /> Previous
                        </button>
                        
                        <div className="flex items-center gap-1.5">
                            {getPageNumbers().map((num, idx) => (
                                <React.Fragment key={idx}>
                                    {num === '...' ? (
                                        <span className="px-2 text-gray-300 font-black tracking-widest">...</span>
                                    ) : (
                                        <button 
                                            onClick={() => typeof num === 'number' && setCurrentPage(num)}
                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all
                                                ${currentPage === num 
                                                    ? "bg-[#0C55A0] text-white shadow-xl shadow-blue-200" 
                                                    : "text-gray-400 hover:bg-white hover:text-[#0C55A0] border border-transparent hover:border-gray-100"
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
                            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-[#0C55A0] hover:border-[#0C55A0]/20 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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