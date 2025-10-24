import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PollCardVoter from "./PollCardVoter";
import { setCreatedPolls } from "@/redux/pollSlice";

const MyVotedPolls = () => {
  const dispatch = useDispatch();
  const { createdPolls } = useSelector((state) => state.polls);

  useEffect(() => {
    const fetchAllPolls = async () => {
      try {
        const response = await fetch("http://localhost:5000/voter/polls", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          dispatch(setCreatedPolls(data.polls));
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchAllPolls();
  }, [dispatch]);

  const now = new Date();
  const pastPolls = createdPolls
    ? createdPolls.filter((poll) => new Date(poll.endDate) <= now)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto ml-96">
      <h2 className="text-3xl font-semibold mb-6">Poll Results</h2>
      {pastPolls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastPolls.map((poll) => (
            <PollCardVoter key={poll._id} poll={poll} />
          ))}
        </div>
      ) : (
        <p>No past polls available.</p>
      )}
    </div>
  );
};

export default MyVotedPolls;
