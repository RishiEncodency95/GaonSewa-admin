import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, deleteProductById } from "../features/inventory/inventorySlice";
import { FiPlus, FiTrash2, FiEdit2, FiPackage } from "react-icons/fi";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.inventory);
  
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    unit: "pcs",
    category: "",
    description: ""
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    dispatch(addProduct(newProduct)).then((res) => {
      if (!res.error) {
        setShowModal(false);
        setNewProduct({ name: "", price: "", stock: "", unit: "pcs", category: "", description: "" });
      }
    });
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProductById(id));
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products Management</h1>
          <p className="text-slate-500">Manage your inventory and pricing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-100 transition-all"
        >
          <FiPlus /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Product</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                      <FiPackage size={20} />
                    </div>
                    <span className="font-medium text-slate-700">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{product.category}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">₹{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {product.stock} {product.unit}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(product._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400">No products found. Start by adding one!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                <input
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Stock</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                />
              </div>
              <div className="space-y-1 text-slate-500">
                <label className="text-xs font-bold text-slate-500 uppercase">Unit</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                >
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kg</option>
                  <option value="litre">Litre</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <input
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
