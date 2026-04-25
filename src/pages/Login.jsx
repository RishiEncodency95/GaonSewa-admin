import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../features/auth/authSlice";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
      style={{ backgroundImage: "url('/login-bg.png')" }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

      <div className="max-w-lg w-full relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-2">
                <img src="/namo_gange.png" alt="Logo" className="w-10 h-10 object-contain invert brightness-0" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Gaon Fresh</h1>
              <p className="text-slate-600 font-medium">Business Operating System</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-shake">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="admin@gaonfresh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In to Console
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>© 2024 GaonFresh</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Server Status: Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
