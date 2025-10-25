import React, { useMemo } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { useSelector} from "react-redux";

const ResultDialog = ({ open, setOpen }) => {
  const {selectedPoll} = useSelector((store) => store.polls);
  // console.log(selectedPoll);

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
          Poll Results for {selectedPoll?.title}
        </DialogTitle>

        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          Description: {selectedPoll?.description}
        </DialogDescription>

        {/* 🧾 Candidate list with vote counts */}
        <div className="space-y-3 mt-4">
          {selectedPoll.poll?.candidates?.map((cand) => (
            <div
              key={cand._id}
              className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {cand.name}
                </p>
                <p className="text-xs text-gray-500">{cand.emailId}</p>
                <h1>Votes: {selectedPoll.poll.results[cand._id.toLowerCase()] || 0}</h1>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
