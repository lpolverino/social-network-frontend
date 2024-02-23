import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App/App.jsx'
import Login from './components/Login/Login.jsx'
import Profile from './components/Profile/Profile.jsx'
import './index.css'
import { createBrowserRouter,RouterProvider} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />
  },
  {
    path: "/",
    element:<App />
  },
  {
    path: "profile/:userId",
    element:<Profile></Profile>
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
)