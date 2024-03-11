import PropTypes from "prop-types"
import { useState } from "react"
import utils from "../../utils"
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer"
import apiRequest from "../../apiRequest"
import { useNavigate } from "react-router-dom"


const UpdateUser = ({updateUser}) => {

  const navigate = useNavigate()
  
  const [image, setImage] = useState({myFile: ""})
  const [about, setAbout] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState(null)
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const base64 = await utils.convertToBase64(file)
    setImage({...image, myFile:base64})
    console.log(base64);
  }

  const sendEdit = async (e) => {
    e.preventDefault()
    setIsEditing(true)
    try{
      await apiRequest.putToBackend(`/users/${utils.getuser()}/profile`,{
        about,
        image: image.myFile,
      })
      updateUser()
      navigate(0)

    }catch (e) {
      console.log(e)
      setError(e)
    }
    finally{
      setIsEditing(false)
    }
  }

  return (
    <>
      {error && <ErrorDisplayer errors={[error]}></ErrorDisplayer>}
      <form>
        <input
          label="Image"
          type="file"
          name="image"
          id="image"
          accept=".jpeg, .png, .jpg"
          onChange={e => handleFileUpload(e)}
        />
        <label htmlFor="about">About:</label>
        <input type="text" name="about" id="about" value={about} onChange={(e) => {setAbout(e.target.value)}}/>
        {isEditing 
          ?<button  onClick={e=> sendEdit(e)}disabled> Save</button>
          :<button onClick={e=> sendEdit(e)}> Save</button>
        }
      </form>
    </>
  )
}

UpdateUser.propTypes = {
  updateUser: PropTypes.func
}
export default UpdateUser