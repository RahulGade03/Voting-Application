import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedPoll } from "@/redux/pollSlice";
import VoteDialog from "./VoteDialog"; // new created dialog
import ResultDialog from "./ResultDialog"; // existing result dialog

// Utility to format date as dd/mm/yyyy
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const PollCardVoter = ({ poll }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      {/* Poll Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{poll.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{poll.description}</p>

        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Start:</span>{" "}
            {formatDate(poll.startDate)}
          </p>
          <p>
            <span className="font-medium text-gray-700">End:</span>{" "}
            {formatDate(poll.endDate)}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => {
          dispatch(setSelectedPoll(poll));
          setOpen(true);
        }}
        className={`mt-4 w-full py-2 px-4 rounded-xl font-medium text-sm transition-colors bg-indigo-600 text-white hover:bg-indigo-700`}
      >
        View Result
      </button>

      <VoteDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default PollCardVoter;
