import React from "react";
import { toast } from "react-toastify";

const VoterInfoDialog = ({ voter, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/delete-voter/${voter._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        onClose()
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(error.message);
      console.error("Delete voter error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-96 p-8">
        <h3 className="text-2xl font-semibold mb-6">Voter Information</h3>
        <p className="mb-2">
          <span className="font-bold">Name:</span> {voter.name}
        </p>
        <p className="mb-2">
          <span className="font-bold">School:</span> {voter.school}
        </p>
        <p className="mb-2">
          <span className="font-bold">Email ID:</span> {voter.emailId}
        </p>
        <p className="mb-6">
          <span className="font-bold">Profession:</span> {voter.profession}
        </p>
        <div className="flex justify-between">
          <button
            className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete Voter
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