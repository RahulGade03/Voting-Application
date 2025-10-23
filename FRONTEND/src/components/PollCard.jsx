import React, { useState } from "react";
import ResultDialog from "./ResultDialog";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedPoll } from "@/redux/pollSlice";

const PollCard = ({ poll }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const {voter, admin} = useSelector((store) => store.auth);

  const handleViewResults = async () => {
    let res;
    if (voter !== null) {
      res = await fetch(`http://localhost:5000/voter/poll-result/${poll.pollId}`, {
        method: 'GET',
        credentials: 'include',
      });
    }
    else if (admin !== null) {
      res = await fetch(`http://localhost:5000/admin/poll-result/${poll.pollId}`, {
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
    await dispatch(setSelectedPoll(pollData));
    setOpen(true);
  }

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

      { (new Date().toISOString()>new Date(poll.endDate).toISOString()) ? <button
        onClick={handleViewResults}
        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
      >
        View Results
      </button> : <p className="font-bold border-2 border-blue-600 p-1 m-2 rounded-2xl text-center">Results not declared yet</p>}

      <ResultDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default PollCard;