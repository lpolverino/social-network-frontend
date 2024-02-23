import { useState } from 'react'
import utils from '../../utils'
import { Navigate } from 'react-router-dom'
import LonginForm from '../LoginForm/LonginForm'
import SingUpForm from '../SingUpForm/SingUpForm'

const Login = () => {
  const [isLogged, setIsLogged] = useState(utils.isLogged())
  const [isLoggin, setIsLoggin] = useState(true)
 
 const setVerifiedUser = (user) =>  {
    setIsLogged(true)
    utils.setToken(user.token)
    utils.setUser(user.user)
  } 

  const createLogin = () =>{
    
    const handleClick = (e) =>{
      e.preventDefault();
      setIsLoggin(prevState => !prevState)
    }
    
    return (
      <>
      { isLoggin 
        ? <LonginForm setLogged = {setVerifiedUser}></LonginForm>
        : <SingUpForm setLogged = {setVerifiedUser}></SingUpForm>
      }
      <button onClick = { (e) => handleClick(e)}> {isLoggin ? "Go to Sing Up":"Go to Log In"} </button>
      </>
    )    
  }

  return (
    <>
    {isLogged 
      ? <Navigate to="/" replace={true}/>
      : createLogin()
    }
    </>
  )
}

export default Login