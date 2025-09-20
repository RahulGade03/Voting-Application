import React, { useState } from "react";
import CreatePoll from "./CreatePoll";

const HomeAdmin = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center bg-white-900 min-h-screen ml-64">
      {/* Big Create Poll Card */}
      <div
        onClick={() => setOpen(true)}
        className="w-[500px] h-[300px] flex items-center justify-center rounded-2xl bg-slate-800 shadow-xl cursor-pointer hover:bg-slate-700 transition"
      >
        <span className="text-2xl font-bold text-white">+ Create Poll</span>
      </div>

      {/* Modal / Drawer for Poll Creation */}
      <CreatePoll open={open} setOpen={setOpen} />
    </div>
  );
};

export default HomeAdmin;
