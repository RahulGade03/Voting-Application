import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCreatedPolls } from "../redux/pollSlice.js"

const useGetMyCreatedPolls = () => {
    const dispatch = useDispatch();
    const { createdPolls } = useSelector((store) => store.polls);
    
    useEffect(() => {
        const fetchCreatedPolls = async() => {
            try {
                const res = await fetch("http://localhost:5000/admin/poll-list",{
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                if (data.success) {
                    dispatch(setCreatedPolls(data.polls));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCreatedPolls();
    }, [createdPolls]);
}

export default useGetMyCreatedPolls;