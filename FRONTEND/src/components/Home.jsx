import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PollCardVoter from "./PollCardVoter";
import { setAvailablePolls } from "@/redux/pollSlice";
import { toast } from "react-toastify";
import { setVoter, setAdmin } from "@/redux/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { availablePolls } = useSelector((store) => store.polls);

  useEffect(() => {
    const fetchAllPolls = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/voter/polls`, {
          method: "GET",
          credentials: "include",
        });
        if (res.status == 401) {
          dispatch(setVoter(null));
          dispatch(setAdmin(null));
          return;
        }
        const data = await res.json();
        if (data?.success) {
          dispatch(setAvailablePolls(data?.polls));
        }
        else {
          throw new Error(data?.error);
        }
      } catch (error) {
        toast.error(error?.message);
        console.error("Error fetching polls:", error);
      }
    };

    fetchAllPolls();
  }, [dispatch]);

  return (
    <div className="p-6 max-w-6xl mx-auto ml-96">
      <h2 className="text-3xl font-semibold mb-6">Ongoing Polls</h2>
      {availablePolls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePolls.map((poll) => (
            <PollCardVoter key={poll?._id} poll={poll} />
          ))}
        </div>
      ) : (
        <p>No ongoing polls currently available for voting.</p>
      )}
    </div>
  );
};

export default Home;