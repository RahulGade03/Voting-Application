import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAdmin, setVoter } from '@/redux/authSlice';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    newPassword: '',
    confirmNewPassword: ''
  })

  const navigate = useNavigate();

  const { admin, voter } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (form.newPassword !== form.confirmNewPassword) {
        toast.error('New Password and Confirm New Password do not match');
        return;
      }

      if (voter) {
        const res = await fetch('https://votingapplicationbackend.vercel.app/voter/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            newPassword: form.confirmNewPassword
          }),
          credentials: 'include'
        })
        const data = await res.json();
        if (data.success === false) {
          throw new Error(data.error);
        }
      }
      else if (admin) {
        const res = await fetch('https://votingapplicationbackend.vercel.app/voter/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            newPassword: form.confirmNewPassword
          }),
          credentials: 'include'
        })
        const data = await res.json();
        if (data?.success === false) {
          throw new Error(data?.error);
        }
      }
      toast.success("Password change successfull!");
      dispatch(setAdmin(null));
      dispatch(setVoter(null));
      navigate('/');
    }
    catch (error) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setAdmin.loading(false);
    }
  }

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
              Blockchain Voting System - Change Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  name="newPassword"
                  required
                  className="pl-10 bg-slate-900/50 text-white border-slate-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Re-enter New Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Re-enter New Password"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  name="confirmNewPassword"
                  required
                  className="pl-10 bg-slate-900/50 text-white border-slate-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Change Password Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-teal-600 hover:bg-teal-500 rounded-xl"
              >
                {loading ? "Please wait..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ChangePassword