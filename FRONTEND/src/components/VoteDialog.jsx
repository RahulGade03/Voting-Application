import React, { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { useSelector } from "react-redux";
import { useWeb3 } from "@/context/Web3Context";

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
  const { voter } = useSelector((store) => store.auth);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { connect, contract, account, web3 } = useWeb3();

  useEffect(() => {
    const checkHasVoted = async () => {
      let currContr = contract;
      let currAcc = account;
      let currWeb3 = web3;
      if (!contract || !account) {
        const {contractInstance, acc, w3} = await connect();
        currContr = contractInstance;
        currAcc = acc;
        currWeb3 = w3;
      }
      const pollId = selectedPoll.pollId.trim().toLowerCase();
      const voterIdHash = currWeb3.utils.soliditySha3(voter._id);
      const hasVoted = await currContr?.methods.hasVotedInPoll(pollId, voterIdHash).call();
      setHasAlreadyVoted(hasVoted);
    }
    checkHasVoted();
  }, [selectedPoll, voter, contract, account])

  const handleCast = async () => {
    try {
      setLoading(true);
      const voterIdHash = web3.utils.soliditySha3(voter._id);
      const res = await contract.methods.castVote(selectedPoll.pollId.trim().toLowerCase(), selectedCandidate.email, selectedCandidate.name, voterIdHash).send({ from: account });
      setHasAlreadyVoted(true);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

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
          Description: {selectedPoll?.description}

          <span className="font-medium text-gray-700 dark:text-gray-300">End Date:</span>{" "}
          {formatDate(selectedPoll?.endDate)}
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
                    setSelectedCandidate({ id: cand._id, name: cand.name, email: cand.emailId })
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
                disabled={!selectedCandidate || loading}
                onClick={handleCast}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${selectedCandidate
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
              >
                {loading ? 'Please approve from metamask' : 'Cast Vote'}
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

export default memo(VoteDialog);
