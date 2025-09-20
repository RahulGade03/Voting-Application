import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import LeftSideBarAdmin from './LeftSideBarAdmin';
import LeftSideBarVoter from './LeftSideBarVoter';

const MainLayout = () => {
  const {voter, admin} = useSelector(store => store.auth);
  return (
    <div>
        {voter && <LeftSideBarVoter/>}
        {admin && <LeftSideBarAdmin/>}
        <Outlet/>
    </div>
  )
}

export default MainLayout