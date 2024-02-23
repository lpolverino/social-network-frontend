import PropTypes from "prop-types"
import { useState } from "react"
import PostDisplayer from "../PostsDisplayer/PostDisplayer"

const ProfileInfo = ({userData, isCurrentUser}) => {
  const {user, posts} = userData
  
  const [imageSource, setImageSource] = useState(user.github_image ?"github":"gravatar")
  
  const changePhoto = (e) => {
    e.preventDefault()
    setImageSource(prevState => prevState === "gravatar"?"github":"gravatar")
  }

  const renderImage = () =>{
    const getImageorText = () => {
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

    return (<>
    {getImageorText()}
    {isCurrentUser && <button onClick={e => changePhoto(e)}> Change image</button>}
    </>
    )
  }

  const showCurrentUser = () => {
    return <>
    {showUser()}
    <button>Edit</button>
    </>
  }

  const sortByDate = (post) => {
    const postCopy = post
    return postCopy.sort((a,b) => {
      return new Date(b.date) - new Date (a.date)
    })
  }

  const showUser = () => {
    return (<>
      <h1>{user.user_name}</h1>
      {renderImage()}
      <p>About:{user.about} </p>
      <p>Born in {user.birth_date}</p>
      <p>Since {user.sing_date}</p>
      <h2> Post </h2>
      <PostDisplayer userPost={sortByDate(posts)}></PostDisplayer>
    </>)
  }

  return (
    <div>
      {isCurrentUser
      ? showCurrentUser()
      : showUser()
    }
    </div>
  )
}

ProfileInfo.propTypes = {
  userData: PropTypes.object,
  isCurrentUser: PropTypes.bool
}

export default ProfileInfo