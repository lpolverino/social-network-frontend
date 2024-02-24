import { useState } from "react"
import PropTypes from 'prop-types'; 
import apiRequest from "../../apiRequest";
import utils from "../../utils";
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer";

const SingUpForm = ({setLogged}) => {

	const [requestPending, setRquestPending] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passwordRepeat, setPasswordRepeat] = useState('')
	const [email, setEmail] = useState('')
	const [errors, setErrors] = useState(null)
	
	const handleSubmit = async (e) =>{
		e.preventDefault()
		
		if(password !== passwordRepeat){
			setErrors(utils.parseError( new Error("passords don't match")))
			return
		}
		setRquestPending(true)
		try{
			const singUpResponseData = await apiRequest.postSignUp({username,password,email})
			setLogged(singUpResponseData)
		}
		catch(e){
			console.log(e);
			setErrors(utils.parseError(e))
		}
		finally{
			setRquestPending(false)
		}
	}

	const createErrorDisplayer = () =>{

		return (
			<ErrorDisplayer errors={[errors]} > </ErrorDisplayer>
		)
	}
  
    return (
    <div>
        <h2>Sing Up</h2>
				{errors && createErrorDisplayer()}
        <form onSubmit={e => handleSubmit(e)}>
					<label htmlFor="username">Username</label>
					<input type="text" name="username" id="username"  value={username} onChange={e => setUsername(e.target.value)}/>
					<label>Password</label>
					<input type="password" name="password" id="password"  value={password} onChange={e => setPassword(e.target.value)}/>
					<label>Repeat Password</label>
					<input type="password" name="passwordRepeat" id="passwordRepeat"  value={passwordRepeat} onChange={e =>setPasswordRepeat(e.target.value)}/>
					<label>Email</label>
					<input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
					{requestPending 
						? <button disabled>Sing Up!</button>
						: <button>Sing up!</button>
					}
				</form>
    </div>
  )
}

SingUpForm.propTypes = {
    setLogged: PropTypes.func
}

export default SingUpForm