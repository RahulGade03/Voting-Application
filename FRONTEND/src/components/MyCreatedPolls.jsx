import React from "react";
import useGetMyCreatedPolls from "../hooks/useGetMyCreatedPolls.jsx";
import { useSelector } from "react-redux";
import PollCard from "./PollCard.jsx";

const MyCreatedPolls = () => {
  useGetMyCreatedPolls();
  const { createdPolls } = useSelector((store) => store.polls);
  return (
    <div className="p-6 ml-64"> {/* <-- margin-left matches sidebar width */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        My Created Polls
      </h2>

      {createdPolls?.length === 0 ? (
        <p className="text-gray-500">You haven’t created any polls yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {createdPolls.map((poll) => (
            <PollCard key={poll.pollId} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCreatedPolls;