import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PollCardVoter from "./PollCardVoter";
import { setCreatedPolls } from "@/redux/pollSlice";

const PollResults = () => {
  const dispatch = useDispatch();
  const { createdPolls } = useSelector((state) => state.polls);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("http://localhost:5000/voter/polls", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          dispatch(setCreatedPolls(data.polls));
        } else {
          console.error("Failed to fetch polls");
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, [dispatch]);

  const now = new Date();

  // Filter polls that have ended or whose endDate is in the past
  const pastPolls = createdPolls
    ? createdPolls.filter((poll) => new Date(poll.endDate) <= now)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto ml-96">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Poll Results
      </h2>
      {pastPolls && pastPolls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastPolls.map((poll) => (
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

export default PollResults;
