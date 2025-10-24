import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PollCardVoter from "./PollCardVoter";
import { setCreatedPolls } from "@/redux/pollSlice";

const MyVotedPolls = () => {
  const dispatch = useDispatch();
  const { createdPolls } = useSelector((state) => state.polls);
  const { voter } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMyVotedPolls = async () => {
      try {
        const response = await fetch(`http://localhost:5000/voter/my-votes`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          dispatch(setCreatedPolls(data.votes)); // assuming data.votes is an array of polls
        } else {
          console.error("Failed to fetch voted polls");
        }
      } catch (error) {
        console.error("Error fetching voted polls:", error);
      }
    };

    if (voter) {
      fetchMyVotedPolls();
    }
  }, [dispatch, voter]);

  const now = new Date();
  // Only show polls whose endDate is in the past
  const pastVotedPolls = createdPolls
    ? createdPolls.filter((poll) => new Date(poll.endDate) <= now)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto ml-96">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Poll Results
      </h2>
      {pastVotedPolls && pastVotedPolls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastVotedPolls.map((poll) => (
            <PollCardVoter key={poll._id} poll={poll} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No past polls available.
        </p>
      )}
    </div>
  );
};

export default MyVotedPolls;
