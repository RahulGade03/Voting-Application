import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setVotedPolls } from "@/redux/pollSlice";
import { toast } from "react-toastify";

const useGetMyVotedPolls = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMyVotedPolls = async () => {
            try {
                const res = await fetch("https://votingapplicationbackend.vercel.app/voter/my-voted-polls", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                if (data.success) {
                    dispatch(setVotedPolls(data.polls));
                }
                else {
                    throw new Error(data.error);
                }
            } catch (error) {
                toast.error(error.message);
                console.log(error);
            }
        }
        fetchMyVotedPolls();
    }, [])
}

export default useGetMyVotedPolls;