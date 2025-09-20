import { setAdmin, setVoter } from '@/redux/authSlice';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Home, LogOut, PlusSquare } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LeftSideBarVoter = () => {
  const { voter } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = [
    {
      icon: (
        <Avatar>
          <AvatarFallback>
            {(voter.name[0] + voter.name[1]).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      text: `Hello, ${voter.name.split(" ")[0]}`,
    },
    { icon: <Home className="w-5 h-5" />, text: "Home" },
    { icon: <PlusSquare className="w-5 h-5" />, text: "My Voted Polls" },
    { icon: <LogOut className="w-5 h-5" />, text: "Logout" },
  ];

  const mapHandler = async (text) => {
    if (text === "Home") {
      navigate("");
    }
    if (text === "My Voted Polls") {
      navigate("my-voted-polls");
    }
    if (text === "Logout") {
      logoutHandler();
    }
  };

    const logoutHandler = async() => {
      const res = await fetch ('http://localhost:5000/voter/logout', {
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
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-teal-400">Voter Panel</h2>
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
  );
};

export default LeftSideBarVoter;
