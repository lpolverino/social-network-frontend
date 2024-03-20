import PropTypes from 'prop-types'; 
import { useState } from 'react';
import utils from '../../utils';
import apiRequest from "../../apiRequest"
import ErrorDisplayer from '../ErrorDisplayer/ErrorDisplayer';
import styles from "./loginForm.module.css"
import { FaGithub } from "react-icons/fa";

const LonginForm = ({setLogged}) => {
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pendingRequest, setPendingRequest] = useState(false)
  const [errors, setErrors] = useState(null)


  const sendLogInRequest =  async (username, password) =>{

    setPendingRequest(true)
    try{
      const loginUserData = await apiRequest.postLogin({username, password})
      setLogged(loginUserData)
    }
    catch(e){
      console.log(e.message);
      setErrors(utils.parseError(e))
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
      if(event.origin === utils.getBackEnd()){
        if(event.data){
          setLogged(event.data)
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
      <ErrorDisplayer errors={[errors]}> </ErrorDisplayer>
    )
  }
  
  return (
      <div className={styles.login}>
          {errors && createErrorDisplayer()}
          <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
              <div className={styles.input}>
                <label htmlFor='username'>Username</label>
                <input type='text' name='username' id='username' value={username} onChange={e => setUsername(e.target.value)}/>
              </div>
              <div className={styles.input}>
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' id='password' value={password} onChange={e => setPassword(e.target.value)}/>
              </div>
              {pendingRequest 
                ? <button disabled className={styles.loginButton}> Log In</button>
                : <button className={styles.loginButton}> Log In</button>
              }
          </form>
          <p className={styles.separetor}>Or</p>
          <div className={styles.accountButtons}>
            <div className={styles.github} onClick={e => handleGithub(e)}>
                <FaGithub size={24}></FaGithub>
              <p>
                Log In with Github
              </p>
            </div>
            <div className={styles.freeAccount} onClick={e => handleFreeTrial(e)}>Free trial</div>
          </div>
      </div>
    )
  }

LonginForm.propTypes = {
    setLogged: PropTypes.func
}

export default LonginForm