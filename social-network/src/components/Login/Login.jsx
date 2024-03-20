import { useState } from 'react'
import utils from '../../utils'
import { Navigate } from 'react-router-dom'
import LonginForm from '../LoginForm/LonginForm'
import styles from "./login.module.css";
import SingUpForm from '../SingUpForm/SingUpForm'
import {motion} from "framer-motion"

const Login = () => {
  const [isLogged, setIsLogged] = useState(utils.isLogged())
  const [isLoggin, setIsLoggin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
 
 const setVerifiedUser = (user) =>  {
    setIsLogged(true)
    utils.setToken(user.token)
    utils.setUser(user.user)
  } 

  const createLogin = () =>{
    
    const handleClick = (e) =>{
      e.preventDefault();
      if( !isAnimating) {
        setIsLoggin(prevState => !prevState)
        setIsAnimating(true)
      }
    }
    
    return (
      <div className={styles.loginConteiner}>
      <button className={styles.toggleButton} onClick = { (e) => handleClick(e)}> {isLoggin ? "Go to Sing Up":"Go to Log In"} </button>
      <div>

      <motion.div
      className={styles.flipCardInner}
      initial={false}
      animate={{rotateY: isLoggin ? 180 : 360}}
      transition={{duration:0.6, animationDirection:"normal"}}
      onAnimationComplete={()=> setIsAnimating(false)}>
        <div className={styles.flipCardFront}>
          <SingUpForm setLogged={setVerifiedUser}></SingUpForm>
        </div>
        <div className={styles.flipCardBack}>
          <LonginForm setLogged={setVerifiedUser}></LonginForm>
        </div>
      </motion.div>

      </div>

      {/* isLoggin 
        ? <LonginForm setLogged = {setVerifiedUser}></LonginForm>
        : <SingUpForm setLogged = {setVerifiedUser}></SingUpForm>
      */}
      </div>
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