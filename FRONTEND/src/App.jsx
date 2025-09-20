import './App.css'
import ChangePassword from './components/ChangePassword';
import Login from './components/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Logout from './components/Logout';
import ProtectedRoutes from './components/ProtectedRoutes';
import LeftSideBarAdmin from './components/LeftSideBarAdmin';
import LeftSideBarVoter from './components/LeftSideBarVoter';
import HomeAdmin from './components/HomeAdmin';
import MyCreatedPolls from './components/MyCreatedPolls';
import SearchVoter from './components/SearchVoter';
import RegisterVoter from './components/RegisterVoter';
import Home from './components/Home';
import MyVotedPolls from './components/MyVotedPolls';
import LoginPage from './components/Login';
import MainLayout from './components/MainLayout';
import AddAdmin from './components/AddAdmin';


const browserRouter = createBrowserRouter([
  {
    path: '/admin/',
    element: <ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children: [
      { path: '', element: <HomeAdmin /> },
      { path: 'my-created-polls', element: <MyCreatedPolls/> },
      { path: 'search-voter', element: <SearchVoter/> }, // inside this component delete voter to implement we can also search with schoolname
      { path: 'register-voter', element: <RegisterVoter/> },
      { path: 'add-admin', element: <AddAdmin/> }
    ]
  },
  {
    path: '/voter/',
    element: <ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children: [
      { path: '', element: <Home /> },
      { path: 'my-voted-polls', element: <MyVotedPolls/> }
    ]
  },
  { path: '/', element: <LoginPage /> },
  { path: '/change-password', element: <ChangePassword /> },
]);

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App;