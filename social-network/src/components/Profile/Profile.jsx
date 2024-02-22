import { NavLink, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import ProfileInfo from "../ProfileInfo/ProfileInfo"
import utils from "../../utils"

const Profile = () => {
  
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState(null)
  const [userData, setUserData] = useState(null)
  
   useEffect( () => {
    const getData = async () => {
      const userId = params.userId
      try{
          const userBackEndUrl = utils.getBackEnd() +"/users/" + userId + "/profile"
          const userResponse = await fetch(userBackEndUrl, {
            headers:{
              'Accept':'application/json',
              'Authorization': `Bearer ${utils.getToken()}`
            },
            method:"GET",
          })
          const userResponseData = await userResponse.json()
          console.log(userResponseData);

          if(!userResponse.ok) throw new Error(`HTTP ERROR ${userResponse.status} when fetching the user ${userId} , ${userResponseData.error.msg}`)
         
          setUserData(userResponseData)
      }
      catch(e){
        console.log(e);
        setErrors(e)
      }
      finally{
        setIsLoading(false)
      }
    }

    getData()
  },[ params])

  return (
    <div>
      <NavLink to={"/"}>Champagne</NavLink>
      { !isLoading && !errors &&
        <ProfileInfo userData={userData} isCurrentUser={utils.getuser() === params.userId} > </ProfileInfo>
      }
    </div>
  )
}

export default Profile