import { v4 as uuidv4 } from "uuid"
import PropTypes from 'prop-types'; 
import { useContext, useEffect, useState } from "react";
import utils from "../../utils";
import { UserContext } from "../DashBoard/DashBoard";
import apiRequest from "../../apiRequest";
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer";

const Notification = () => {  

  const {user} = useContext(UserContext)

  const [error, setError] = useState(null)
  
  const notifications = user.notifications.notifications 

  const notificationsToRender = notifications.map(notification => { return {...notification, id: uuidv4()}})

  useEffect(() =>{
    //clean Notifications
    const clearNotifications = async () => {
      const backendUrl = "/users/" +utils.getuser() + "/notifications"
      try{
        await apiRequest.putToBackend(backendUrl)  
      }
      catch(e){
        console.log(e);
        setError(utils.parseError(e))
      }
    }
    clearNotifications()
  },[user])

  const showError = () => {
    return <ErrorDisplayer errors={[error]}> </ErrorDisplayer>
  } 

  const showNotifications = () => {
    return <ul>
        {notificationsToRender.map(notification => <li key={notification.id}>{notification.content}</li>)}
    </ul>
  }

  return (
    <div>
      <h1>Notifications</h1>
      {error
        ? showError()
        : showNotifications()
      }
    </div>
  )
}

Notification.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    content:PropTypes.string.isRequired,
    url:PropTypes.string.isRequired,
    type:PropTypes.oneOf(["Follow", "Post"])
  }))
}

export default Notification