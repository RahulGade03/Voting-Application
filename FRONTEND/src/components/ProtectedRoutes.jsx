import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    const {voter, admin} = useSelector (store => store.auth);
    const navigate = useNavigate ();
    useEffect (() => {
        if (!voter && !admin) {
            navigate ("/")
        }
    }, [])
  return <>{children}</>
}

export default ProtectedRoutes;