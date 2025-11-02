import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setVotedPolls } from "@/redux/pollSlice";
import { toast } from "react-toastify";
import { setVoter, setAdmin } from "@/redux/authSlice";

const useGetMyVotedPolls = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMyVotedPolls = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/voter/my-voted-polls`, {
                    method: "GET",
                    credentials: "include"
                });
                if (res.status == 401) {
                    dispatch(setVoter(null));
                    dispatch(setAdmin(null));
                    return;
                }
                const data = await res.json();
                if (data?.success) {
                    dispatch(setVotedPolls(data?.polls));
                }
                else {
                    throw new Error(data?.error);
                }
            } catch (error) {
                toast.error(error?.message);
                console.log(error);
            }
        }
        fetchMyVotedPolls();
    }, [])
}

export default useGetMyVotedPolls;