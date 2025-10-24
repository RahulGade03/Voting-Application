import React, { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";  
import { setSelectedPoll } from "@/redux/pollSlice";

// Utility to format date as dd/mm/yyyy
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const PollDialog = ({open, setOpen}) => {
  const {selectedPoll} = useSelector((store) => store.polls);
  console.log(selectedPoll);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-md z-40" />
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl 
          -translate-x-1/2 -translate-y-1/2
          p-8 rounded-2xl shadow-2xl
          bg-white dark:bg-zinc-900 space-y-6"
      >
        <DialogTitle className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          {selectedPoll?.title}
        </DialogTitle>

        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          <p>Description: {selectedPoll?.description}</p>
        </DialogDescription>

        {/* 🧾 Candidate list with vote counts */}
        <div className="space-y-3 mt-4">
          {selectedPoll.poll.candidates.map((cand) => (
            <div
              key={cand._id}
              className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800"
            >
              <div>
                <p className="font-medium text-black dark:text-gray-100">
                  {cand.name}
                </p>
                <p className="text-xs text-gray-500">{cand.emailId}</p>
              </div>
              {/* <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {candidateVotes[cand._id] ?? 0} votes
              </span> */}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PollCardVoter = ({ poll }) => {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const isOngoing = new Date(poll.endDate) > now;
  const dispatch = useDispatch();

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
        onClick={() => {
          dispatch(setSelectedPoll(poll));
          setOpen(true)
        }}
        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
      >
        {isOngoing ? "View / Vote" : "View Result"}
      </button>
      <PollDialog open={open} setOpen={setOpen}/>
    </div>
  );
};

export default PollCardVoter;
