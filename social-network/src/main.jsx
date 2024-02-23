import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App/App.jsx'
import Login from './components/Login/Login.jsx'
import Profile from './components/Profile/Profile.jsx'
import './index.css'
import { createBrowserRouter,RouterProvider} from 'react-router-dom';
import apiRequestHandler from './apiRequest.js'


export const ApiContext = createContext(null)

const router = createBrowserRouter([
  {
    path: "login",
    element:<ApiContext.Provider value={{api:apiRequestHandler()}}>
              <Login />
            </ApiContext.Provider> 
  },
  {
    path: "/",
    element: <ApiContext.Provider value = {{api:apiRequestHandler()}}>
              <App />
            </ApiContext.Provider>
  },
  {
    path: "profile/:userId",
    element:<ApiContext.Provider value ={{api:apiRequestHandler()}}>
              <Profile></Profile>
            </ApiContext.Provider>
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
)