import { Home, Search, PlusSquare, LogOut } from "lucide-react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // if you are using react-router
import CreatePoll from "./CreatePoll";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { setAdmin, setVoter } from "@/redux/authSlice";

const LeftSideBarAdmin = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((store) => store.auth);

  const items = [
    {
      icon: (
        <Avatar>
          <AvatarFallback>{(admin.name[0]+admin.name[1]).toUpperCase()}</AvatarFallback>
        </Avatar>
      ),
      text: `Hello, ${admin.name.split(" ")[0]}`,
    },
    { icon: <Home className="w-5 h-5" />, text: "Home" },
    { icon: <PlusSquare className="w-5 h-5" />, text: "Create Poll" },
    { icon: <PlusSquare className="w-5 h-5" />, text: "My Posted Polls" },
    { icon: <Search className="w-5 h-5" />, text: "Register Admin" },
    { icon: <PlusSquare className="w-5 h-5" />, text: "Register Voter" },
    { icon: <Search className="w-5 h-5" />, text: "Search Voter" },
    { icon: <LogOut className="w-5 h-5" />, text: "Logout" },
  ];

  const mapHandler = async (text) => {
    if (text === "Home") {
      navigate("/admin");
    }
    if (text === "Create Poll") {
      setOpen(true);
    }
    if (text === "My Posted Polls") {
      navigate("my-created-polls");
    }
    if (text === "Register Voter") {
      navigate("register-voter");
    }
    if (text === "Search Voter") {
      navigate("search-voter");
    }
    if (text === "Add Admin") {
      if (admin.access === 'all') {
        navigate("add-admin");
      }
    }
    if (text === "Logout") {
      logoutHandler();
    }
  };

  const logoutHandler = async() => {
    const res = await fetch ('http://localhost:5000/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    console.log(data);
    dispatch(setAdmin(null));
    dispatch(setVoter(null));
    navigate('/');
  }

  return (
    <>
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-200 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-teal-400">Admin Panel</h2>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => mapHandler(item.text)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-800 transition"
          >
            <div className="text-teal-400">{item.icon}</div>
            <div className="font-medium">{item.text}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        © 2025 Voting System
      </div>

    </div>
      <CreatePoll open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSideBarAdmin;
