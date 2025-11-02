import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    const {voter, admin} = useSelector (store => store.auth);
    const navigate = useNavigate ();
    const dispatch = useDispatch();
    useEffect (() => {
        if (!voter && !admin) {
            navigate ("/")
        }
    }, [dispatch])

  return (
    <>
        {children}
    </>
  )
}

export default ProtectedRoutes;