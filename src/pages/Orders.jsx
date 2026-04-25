import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyOrders, updateOrderStatus } from "../features/orders/ordersSlice";
import { FiShoppingBag, FiEye, FiClock, FiTruck, FiXCircle } from "react-icons/fi";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchCompanyOrders());
  }, [dispatch]);

  const handleUpdateStatus = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
        <p className="text-slate-500">Track and fulfill customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', count: orders.length, icon: FiShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length, icon: FiClock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length, icon: FiTruck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length, icon: FiXCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Order ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Items</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-slate-400">#{order._id.slice(-6).toUpperCase()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm text-slate-600">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">₹{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.orderStatus)}`}>
                    {order.orderStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {order.orderStatus === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition-all"
                      >
                        Confirm
                      </button>
                    )}
                    {order.orderStatus === 'confirmed' && (
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'delivered')}
                        className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition-all"
                      >
                        Deliver
                      </button>
                    )}
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                      <FiEye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400">No orders found yet.</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
