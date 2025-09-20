import React, { useState } from "react";
import ResultDialog from "./ResultDialog";

const PollCard = ({ poll }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{poll.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{poll.description}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Start:</span>{" "}
            {new Date(poll.startDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium text-gray-700">End:</span>{" "}
            {new Date(poll.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
      >
        View Results
      </button>

      <ResultDialog open={open} setOpen={setOpen} poll={poll} />
    </div>
  );
};

export default PollCard;
