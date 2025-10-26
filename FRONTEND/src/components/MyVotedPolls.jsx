import React from "react";
import { useSelector } from "react-redux";
import PollCard from "./PollCard";
import useGetMyVotedPolls from "../hooks/useGetMyVotedPolls.jsx";

const MyVotedPolls = () => {
  const { votedPolls } = useSelector((store) => store.polls);
  useGetMyVotedPolls();

  return (
    <div className="p-6 max-w-6xl mx-auto ml-96">
      <h2 className="text-3xl font-semibold mb-6">Poll Results</h2>
      {votedPolls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {votedPolls.map((poll) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </div>
      ) : (
        <p>No past polls available.</p>
      )}
    </div>
  );
};

export default MyVotedPolls;