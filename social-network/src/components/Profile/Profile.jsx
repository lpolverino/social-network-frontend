import { UserContext } from "../DashBoard/DashBoard"
import { useContext, useEffect, useState } from "react"

const Profile = () => {
  
  const {user} = useContext(UserContext)
  const [imageSource, setImageSource] = useState("gravatar")

  const changePhoto = (e) => {
    e.preventDefault()
    setImageSource(prevState => prevState === "gravatar"?"github":"gravatar")
  }

  const renderIamage = () =>{
    if(imageSource === "gravatar"){
       if(user.image === undefined){
        return <p>You dont have a email to get the Gravatar profile icon</p>
       }else{
        return <img src ={user.image} alt={`profile icon from gravatar for user ${user.user_name}`}/>
       }
    }
    else{
      if (user.github_image === undefined){
        return <p> You Dont have a Github account binded to your account </p>
      }else{
        return <img src={user.github_image} alt={`Github profile Icon for the user ${user.user_name}`}/>
      }
    }
  }

  return (
    <div>
      <div>
        {renderIamage()}
        <p>This website use your gravatar account or github image</p>
        <button onClick={(e) => changePhoto(e)}> Use {imageSource ==="gravatar" ? "github":"gravatar"} Image </button>

      </div>
      <h1>{user.user_name}</h1>
    </div>
  )
}

export default Profile