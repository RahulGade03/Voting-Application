import React, { useState } from "react";
import ResultDialog from "./ResultDialog";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedPoll } from "@/redux/pollSlice";
import { useWeb3 } from "@/context/Web3Context";
import { toast } from "react-toastify";

// Format date as dd/mm/yyyy
function formatDate(dateStr) {
  const date = new Date(dateStr); // ex. dateStr = "2025-10-27T10:30:00Z"
  const day = String(date.getDate()).padStart(2, "0");  // getDate gives Day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth returns 0-based month (0 - Jan)
  const year = date.getFullYear(); // getFullYear gives 4-digit year
  return `${day}/${month}/${year}`;
}

const PollCard = ({ poll }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { voter, admin } = useSelector((store) => store.auth);
  const { contract, connect, account, web3 } = useWeb3();
  const [loading, setLoading] = useState(false);


  const handleViewResults = async () => {
    try {
      setLoading(true)
      if (!contract) {
        await connect();
      }
      let res;
      if (voter !== null) {
        res = await fetch(`https://votingapplicationbackend.vercel.app/voter/poll-result/${poll.pollId}`, {
          method: 'GET',
          credentials: 'include',
        });
      }
      else if (admin !== null) {
        res = await fetch(`https://votingapplicationbackend.vercel.app/admin/poll-result/${poll.pollId}`, {
          method: 'GET',
          credentials: 'include',
        });
      }
      const data = await res.json();
      console.log(data);
      const pollData = {
        ...data,
        title: poll.title,
        description: poll.description,
      }

      dispatch(setSelectedPoll(pollData));
      setOpen(true);
    } catch (error) {
      toast.error(error.message);
      console.log();
    } finally {
      setLoading(false);
    }
  }

  const pollEnded = new Date() > new Date(poll.endDate);
  // console.log(new Date(), poll.endDate, new Date(poll.endDate));

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{poll?.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{poll?.description}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Start:</span>{" "}
            {formatDate(poll?.startDate)}
          </p>
          <p>
            <span className="font-medium text-gray-700">End:</span>{" "}
            {formatDate(poll?.endDate)}
          </p>
        </div>
      </div>

      {pollEnded ? (
      <button
        onClick={handleViewResults}
        className = {`mt-4 w-full py-2 px-4 ${!loading ? "bg-indigo-600" : "bg-indigo-500"} text-white rounded-xl font-medium text-sm hover: ${!loading ? "bg-indigo-700" : "bg-indigo-500"} transition-colors`}
      >
        {!loading ?  "View Results" : "Please wait..."}
      </button>
      ) : (
      <p className="font-bold border-2 border-blue-600 p-1 m-2 rounded-2xl text-center">
          Results not declared yet
        </p>
      )}

      <ResultDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default PollCard;
