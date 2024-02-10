import { useState } from 'react'
import utils from '../../utils'
import { useNavigate, Navigate } from 'react-router-dom'
import LonginForm from '../LoginForm/LonginForm'
import SingUpForm from '../SingUpForm/SingUpForm'

const Login = () => {
  const [isLogged, setIsLogged] = useState(utils.isLogged())
  const [isLoggin, setIsLoggin] = useState(true)
  const navigator = useNavigate()

  const createLogin = () =>{
    
    const handleClick = (e) =>{
      e.preventDefault();
      setIsLoggin(prevState => !prevState)
    }
    
    return (
      <>
      { isLoggin 
        ? <LonginForm setLogged = {setIsLogged}></LonginForm>
        : <SingUpForm setLogged = {setIsLogged}></SingUpForm>
      }
      <button onClick = { (e) => handleClick(e)}> {isLoggin ? "Sing Up":"Log In"} </button>
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