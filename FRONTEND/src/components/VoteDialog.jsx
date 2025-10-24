import React, { useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { useSelector } from "react-redux";

// Utility function to format date as dd/mm/yyyy
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const VoteDialog = ({ open, setOpen }) => {
  const { selectedPoll } = useSelector((store) => store.polls);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Placeholder for whether user has already voted (to be fetched from backend later)
  const hasAlreadyVoted = selectedPoll.hasVoted ?? false;

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
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">End Date:</span>{" "}
            {formatDate(selectedPoll?.endDate)}
          </p>
        </DialogDescription>

        {!hasAlreadyVoted ? (
          <>
            {/* Candidate selection list */}
            <div className="space-y-3 mt-4">
              {selectedPoll?.candidates?.map((cand) => (
                <div
                  key={cand._id}
                  className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition
                    border-gray-200 dark:border-gray-700 
                    ${selectedCandidate?.id === cand._id ? "bg-indigo-100 dark:bg-indigo-900" : "bg-gray-50 dark:bg-zinc-800"}
                  `}
                  onClick={() =>
                    setSelectedCandidate({ id: cand._id, name: cand.name })
                  }
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{cand.name}</p>
                    <p className="text-xs text-gray-500">{cand.emailId}</p>
                  </div>
                  <input
                    type="radio"
                    name="candidate"
                    checked={selectedCandidate?.id === cand._id}
                    onChange={() =>
                      setSelectedCandidate({ id: cand._id, name: cand.name })
                    }
                    className="h-5 w-5 text-indigo-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Vote button */}
            <div className="flex justify-end mt-6">
              <button
                disabled={!selectedCandidate}
                onClick={() => alert("Vote submitted! (Functionality coming soon)")}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCandidate
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Cast Vote
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              You have already cast your vote in this poll.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VoteDialog;
