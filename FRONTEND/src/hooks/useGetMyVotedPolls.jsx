import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setVotedPolls } from "@/redux/pollSlice";

const useGetMyVotedPolls = () => {
    const dispatch = useDispatch();
    const { voter } = useSelector((store) => store.auth);
    // console.log("Entered useGetMyVotedPolls");
    useEffect(() => {
        // console.log("Entered useEffect");
        const fetchMyVotedPolls = async () => {
            // console.log("Entered fetchMyVotedPolls");
            try {
                const res = await fetch("http://localhost:5000/voter/my-voted-polls", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                // console.log("Data: ", data);
                if (data.success) {
                    dispatch(setVotedPolls(data.polls));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchMyVotedPolls();
    }, [])
}

export default useGetMyVotedPolls;