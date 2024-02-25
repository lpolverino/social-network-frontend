import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App/App.jsx'
import Login from './components/Login/Login.jsx'
import Profile from './components/Profile/Profile.jsx'
import Notification from './components/Notification/Notification.jsx'
import './index.css'
import { createBrowserRouter,RouterProvider} from 'react-router-dom';
import PostDisplayer from './components/PostsDisplayer/PostDisplayer.jsx'
import Friends from './components/Friends/Friends.jsx'


const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />
  },  
  {
    path: "/",
    element:<App />,
    children:[
      {
        path:"index",
        index:true,
        element:<PostDisplayer></PostDisplayer>
      },
      {
        path:"followers",
        element:<Friends></Friends>
      },
      {
        path:"notifications",
        element:<Notification></Notification>
      },
      {
       path: "profile/:userId", 
      element:<Profile></Profile>   
      },
      {
        path:"posts/:postId",
        element:<PostDisplayer></PostDisplayer>
      }
    ]  
  },  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
)