import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PollCardVoter from "./PollCardVoter";
import { setCreatedPolls } from "@/redux/pollSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { createdPolls } = useSelector((state) => state.polls);

  useEffect(() => {
    const fetchOngoingPolls = async () => {
      try {
        const response = await fetch("http://localhost:5000/voter/polls", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        // console.log(data);
        if (data.success) {
          dispatch(setCreatedPolls(data.polls));
        } else {
          console.error("Failed to fetch polls");
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchOngoingPolls();
  }, [dispatch]);

  const today = new Date();

  // Only show polls where endDate is in the future
  const ongoingPolls = createdPolls
    ? createdPolls.filter((poll) => new Date(poll.endDate) > today)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto ml-96">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Ongoing Polls
      </h2>
      {ongoingPolls && ongoingPolls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingPolls.map((poll) => (
            <PollCardVoter key={poll._id} poll={poll} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No ongoing polls currently available for voting.
        </p>
      )}
    </div>
  );
};

export default Home;
