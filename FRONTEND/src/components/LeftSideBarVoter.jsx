import { setAdmin, setVoter } from '@/redux/authSlice';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Home, LogOut, PlusSquare, ListTodo } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WalletButton from './WalletButton';

const LeftSideBarVoter = () => {
  const { voter } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = [
    // {
    //   icon: (
    //     <Avatar>
    //       <AvatarFallback>
    //         {(voter.name[0] + voter.name[1]).toUpperCase()}
    //       </AvatarFallback>
    //     </Avatar>
    //   ),
    //   text: `Hello, ${voter.name.split(" ")[0]}`,
    // },
    { icon: <Home className="w-5 h-5" />, text: "Home" },
    { icon: <ListTodo className="w-5 h-5" />, text: "Poll Results" },
    { icon: <LogOut className="w-5 h-5" />, text: "Logout" },
  ];

  const mapHandler = async (text) => {
    if (text === "Home") {
      navigate("");
    }
    if (text === "Poll Results") {
      navigate("my-voted-polls");
    }
    if (text === "Logout") {
      logoutHandler();
    }
  };

  const logoutHandler = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/voter/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (res.status == 401) {
      dispatch(setVoter(null));
      dispatch(setAdmin(null));
      return;
    }
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
        {items?.map((item, index) => (
          <div
            key={index}
            onClick={() => mapHandler(item?.text)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-800 transition"
          >
            <div className="text-teal-400">{item?.icon}</div>
            <div className="font-medium">{item?.text}</div>
          </div>
        ))}
      </div>
      <WalletButton />

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        © 2025 OpenBallot
      </div>
    </div>
  );
};

export default LeftSideBarVoter;
