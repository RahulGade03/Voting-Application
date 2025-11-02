import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VoterInfoDialog = ({ voter, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-voter/${voter._id}`, {
        method: "DELETE",
        credentials: "include",
      }
      );
      if (res.status == 401) {
        navigate("/");
        return;
      }
      const data = await res.json();
      if (data?.success) {
        toast.success(data?.message);
        onClose()
      } else {
        throw new Error(data?.error);
      }
    } catch (error) {
      toast.error(error?.message);
      console.error("Delete voter error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-96 p-8">
        <h3 className="text-2xl font-semibold mb-6">Voter Information</h3>
        <p className="mb-2">
          <span className="font-bold">Name:</span> {voter?.name}
        </p>
        <p className="mb-2">
          <span className="font-bold">School:</span> {voter?.school}
        </p>
        <p className="mb-2">
          <span className="font-bold">Email ID:</span> {voter?.emailId}
        </p>
        <p className="mb-6">
          <span className="font-bold">Profession:</span> {voter?.profession}
        </p>
        <div className="flex justify-between">
          <button
            className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            {loading ? "Please wait..." : "Delete Voter"}
          </button>
          <button
            className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoterInfoDialog;