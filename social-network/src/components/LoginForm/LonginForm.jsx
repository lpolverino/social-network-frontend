import PropTypes from 'prop-types'; // ES6
import { useState } from 'react';
import utils from '../../utils';

const LonginForm = ({setLogged}) => {
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pendingRequest, setPendingRequest] = useState(false)
  const [errors, setErrors] = useState(null)

  const sendLogInRequest =  async (username, password) =>{

    setPendingRequest(true)
    const backendUrl = utils.getBackEnd() + "/login"
    try{
      const respone = await fetch(backendUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({username, password})
      })
      const responeData = await respone.json()
      if(respone.ok){
        setLogged(true)
        utils.setToken(responeData.token)
        utils.setUser(responeData.user)
      }else{
        console.log(responeData.message);
        throw new Error(responeData.message)
      }
    }
    catch (e){
      console.log(e)
      setErrors(e.message)
    }
    finally{
      setPendingRequest(false)
    }
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    sendLogInRequest(username, password)
  }

  const handleGithub = (e) =>{
    e.preventDefault()
    const backendUrl = utils.getBackEnd() + "/auth/github"
    const popup = window.open(backendUrl,
      "targetWindow",
      `toolbar=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      rezisable=yes,
      width=620,
      height=700`
    )
    window.addEventListener("message", (event) =>{
      console.log("received data");
      if(event.origin === utils.getBackEnd()){
        if(event.data){
          console.log(event.data);
          utils.setToken(event.data.token)
          utils.setUser(event.data.user) 
          setLogged(true)
          popup?.close()
        }
      }
    })
  }
  const handleFreeTrial = (e) => {
    e.preventDefault()
    const {anonymusUsername, anonymusPassword} = utils.getAnonymusUser()
    sendLogInRequest(anonymusUsername, anonymusPassword)
  }

  const createErrorDisplayer = () => {
    return (
      <p>{errors}</p>
    )
  }
  
  return (
      <div>
          <h2>Log In</h2>
          {errors && createErrorDisplayer()}
          <form onSubmit={(e) => handleSubmit(e)}>
              <label htmlFor='username'>Username</label>
              <input type='text' name='username' id='username' value={username} onChange={e => setUsername(e.target.value)}/>
              <label htmlFor='password'>Password</label>
              <input type='password' name='password' id='password' value={password} onChange={e => setPassword(e.target.value)}/>
              {pendingRequest 
                ? <button disabled> Log In</button>
                : <button> Log In</button>
              }
          </form>
          <div onClick={e => handleGithub(e)}>Github</div>
          <div onClick={e => handleFreeTrial(e)}>Free trial</div>
      </div>
    )
  }

LonginForm.propTypes = {
    setLogged: PropTypes.func
}

export default LonginForm