import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCreatedPolls } from "../redux/pollSlice.js"
import { toast } from "react-toastify";

const useGetMyCreatedPolls = () => {
    const dispatch = useDispatch();
    const { createdPolls } = useSelector((store) => store.polls);
    
    useEffect(() => {
        const fetchCreatedPolls = async() => {
            try {
                const res = await fetch("https://votingapplicationbackend.vercel.app/admin/poll-list",{
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                if (data?.success) {
                    dispatch(setCreatedPolls(data?.polls));
                }
                else {
                    throw new Error(data?.error);
                }
            } catch (error) {
                toast.error(error?.message);
                console.log(error);
            }
        }
        fetchCreatedPolls();
    }, [createdPolls]);
}

export default useGetMyCreatedPolls;