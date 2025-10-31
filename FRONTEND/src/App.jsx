import './App.css'
import ChangePassword from './components/ChangePassword';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import HomeAdmin from './components/HomeAdmin';
import MyCreatedPolls from './components/MyCreatedPolls';
import SearchVoter from './components/SearchVoter';
import RegisterVoter from './components/RegisterVoter';
import Home from './components/Home';
import MyVotedPolls from './components/MyVotedPolls';
import LoginPage from './components/Login';
import MainLayout from './components/MainLayout';
import AddAdmin from './components/AddAdmin';
import ForgotPassword from './components/ForgotPassword';
import { ToastContainer, Zoom } from 'react-toastify';

const browserRouter = createBrowserRouter([
  {
    path: '/admin/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '', element: <HomeAdmin /> },
      { path: 'my-created-polls', element: <MyCreatedPolls /> },
      { path: 'search-voter', element: <SearchVoter /> }, // inside this component delete voter to implement we can also search with schoolname
      { path: 'register-voter', element: <RegisterVoter /> },
      { path: 'add-admin', element: <AddAdmin /> }
    ]
  },
  {
    path: '/voter/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '', element: <Home /> },
      { path: 'my-voted-polls', element: <MyVotedPolls /> }
    ]
  },
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/change-password',
    element: <ChangePassword />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
    </>
  )
}

export default App;