import { v4 as uuidv4 } from "uuid"
import PropTypes from 'prop-types'; 
import { useContext, useEffect, useState } from "react";
import utils from "../../utils";
import { UserContext } from "../DashBoard/DashBoard";

const Notification = () => {  

  const {user} = useContext(UserContext)

  const [error, setError] = useState(null)
  
  const notifications = user.notifications.notifications 

  const notificationsToRender = notifications.map(notification => { return {...notification, id: uuidv4()}})

  useEffect(() =>{
    //clean Notifications
    const clearNotifications = async () => {
      const backendUrl = utils.getBackEnd() +"/users/" +utils.getuser() + "/notifications"
      try{

        const response = await fetch(backendUrl, {
          headers:{
          'Authorization':`Bearer ${utils.getToken()}`,
          'Accept':'application/json',
          'Content-type':'application/json',
          },
          method:"PUT"
        })
        const responseData = await response.json()
        if(!response.ok){
          throw new Error("cannot read the notifications" + responseData.msg)
        }  
      }
      catch(e){
        console.log(e);
        setError(e.message)
      }
    }
    clearNotifications()
  },[])

  const showError = () => {
    return <p> There was an Http error : {error}</p>
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