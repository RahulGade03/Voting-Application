import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setAdmin, setVoter } from "@/redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter"); // default role

  const dispatch = useDispatch();
  const {voter, admin} = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (role === 'voter') {
        const voterRes = await fetch ('http://localhost:5000/voter/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emailId: email,
            password
          }),
          credentials: 'include' // include cookies in the request
        })
        const voterData = await voterRes.json();
        // console.log(voterData);
        if (voterData) {
          dispatch(setVoter(voterData.voter));
          if (voterData.voter.mustChangePassword) {
            navigate('/change-password');
          }
          else {
            navigate('/voter');
          }
        }
      }
      else if (role === 'admin') {
        const adminRes = await fetch ('http://localhost:5000/admin/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emailId: email,
            password: password
          }),
          credentials: 'include'
        })
        const adminData = await adminRes.json();
        // console.log(adminData);
        if (adminData.admin) {
          dispatch(setAdmin(adminData.admin));
          if (adminData.admin.mustChangePassword) {
            navigate('/change-password');
          }
          else {
            navigate('/admin');
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-md">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
              Blockchain Voting System
            </h2>
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-900/50 text-white border-slate-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-900/50 text-white border-slate-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-slate-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Select Role
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("voter")}
                    className={`flex-1 py-2 rounded-lg border transition ${
                      role === "voter"
                        ? "bg-teal-600 text-white border-teal-500"
                        : "bg-slate-900/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                    }`}
                  >
                    Voter
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex-1 py-2 rounded-lg border transition ${
                      role === "admin"
                        ? "bg-teal-600 text-white border-teal-500"
                        : "bg-slate-900/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-teal-600 hover:bg-teal-500 rounded-xl"
              >
                Login
              </Button>
            </form>
          </CardContent>
          <Link to={'/forgot-password'} className="text-gray-300 underline self-center">Forgot Password?</Link>
        </Card>
      </motion.div>
    </div>
  );
}
