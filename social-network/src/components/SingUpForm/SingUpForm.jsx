import { useState } from "react"
import utils from "../../utils"
import PropTypes from 'prop-types'; 

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
			setErrors([{message:"passords don't match"}])
			return
		}

		setRquestPending(true)
		try{
			const backendUrl = utils.getBackEnd() + "/singup"
			const response = await fetch( backendUrl,{
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
				method:"POST",
				body:JSON.stringify({username,password,email})
			})

			const responseData = await response.json()

			if(!response.ok){
				setErrors(responseData.errors)
				return
			}
			
			utils.setToken(responseData.token)
			utils.setUser(responseData.user)
			setLogged(true)
		}catch(e){
			setErrors(e)
			console.log(e);
		}finally{
			setRquestPending(false)
		}
	}

	const createErrorDisplayer = () =>{
		console.log(errors);
		return (
			<ul>
				{errors.map(error => <li key={error.msg}> {error.msg} </li>)}
			</ul>
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