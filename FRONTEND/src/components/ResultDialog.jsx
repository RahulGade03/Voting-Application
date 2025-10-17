import React, { useMemo } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";

const ResultDialog = ({ open, setOpen, poll }) => {
  // Compute vote counts per candidate
  const candidateVotes = useMemo(() => {
    const counts = {};
    poll.candidates.forEach((cand) => {
      counts[cand._id] = 0;
    });

    poll.votes.forEach((vote) => {
      if (counts[vote.candidate]) {
        counts[vote.candidate] += 1;
      }
    });

    return counts;
  }, [poll]);

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
          Poll Results for {poll.title}
        </DialogTitle>

        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          <p>Description: {poll.description}</p>
        </DialogDescription>

        {/* 🧾 Candidate list with vote counts */}
        <div className="space-y-3 mt-4">
          {poll.candidates.map((cand) => (
            <div
              key={cand._id}
              className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {cand.name}
                </p>
                <p className="text-xs text-gray-500">{cand.emailId}</p>
              </div>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {candidateVotes[cand._id] ?? 0} votes
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
