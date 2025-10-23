import React, { useState } from "react";

// Utility to format date as dd/mm/yyyy
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const PollDialog = ({ poll, open, setOpen, isOngoing }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-[90vw] max-w-lg p-8 shadow-lg">
        <h3 className="text-2xl font-semibold mb-6">{poll.title}</h3>
        <p className="mb-2">
          <span className="font-bold">Description:</span> {poll.description}
        </p>
        <p className="mb-2">
          <span className="font-bold">Start Date:</span> {formatDate(poll.startDate)}
        </p>
        <p className="mb-2">
          <span className="font-bold">End Date:</span> {formatDate(poll.endDate)}
        </p>
        {/* Candidates and additional poll info may go here */}
        <div className="flex justify-between mt-8">
          {isOngoing ? (
            <button
              className="px-6 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              // onClick={handleCastVote} // Add logic later
            >
              Cast Vote
            </button>
          ) : (
            <button
              className="px-6 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              // onClick={handleShowResult} // Add logic for showing more result details later
            >
              View Result
            </button>
          )}
          <button
            className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 font-semibold"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PollCardVoter = ({ poll }) => {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const isOngoing = new Date(poll.endDate) > now;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
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
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
      >
        {isOngoing ? "View / Vote" : "View Result"}
      </button>
      <PollDialog poll={poll} open={open} setOpen={setOpen} isOngoing={isOngoing} />
    </div>
  );
};

export default PollCardVoter;
