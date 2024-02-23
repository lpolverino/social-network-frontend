import { NavLink, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import ProfileInfo from "../ProfileInfo/ProfileInfo"
import utils from "../../utils"
import { ApiContext } from "../../main"

const Profile = () => {
  
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState(null)
  const [userData, setUserData] = useState(null)
  
  const {api} = useContext(ApiContext)

   useEffect( () => {
    const getData = async () => {
      const userId = params.userId
      try{
          const userBackEndUrl = "/users/" + userId + "/profile"
          const userResponseData = await api.getFromBackend(userBackEndUrl)
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
  },[ api, params])

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