import { useContext, useState } from "react"
import { UserContext } from "../DashBoard/DashBoard"
import utils from "../../utils"

const Friends = () => {

	const [isShowingFollowing, setIsShowingFollowing] = useState(true)
	const [searchBarText, setSearchBarText] = useState('')
	const [followRequestPending, setFollowRequestPending] = useState(false)
	const [error,setError] = useState(null)


	const {user, updateUser} = useContext(UserContext)

	const sendFollow = async (e) => {
		e.preventDefault()
		console.log(`send request to ${searchBarText}`);
		setFollowRequestPending(true)
		const backendUrl = utils.getBackEnd() + "/users/" + utils.getuser() +"/follow"
		try{
			const response = await fetch(backendUrl, {
				headers:{
					'Authorization':`Bearer ${utils.getToken()}`,
					'Accept':'application/json',
					'Content-type':'application/json',
				},
				method:"POST",
				body:JSON.stringify({username:searchBarText})
			})
			const responseData = await response.json()
			if(!response.ok){
				const errorData = `THere was an http error ${response.status} ${responseData.errors.msg}`
				setError(errorData)
				return
			}

			const newUser = {
				...user,
				following : user.following.concat([responseData.followedUser])
			}
			updateUser(newUser)
		}
		catch(e){
			console.log(e);
			setError(e)
		}finally{
			setFollowRequestPending(false)
		}
	}

	const createButton = (text,value) => {
		return <button onClick={() => setIsShowingFollowing(value)}> {text} </button>
	}

	
	const showUsers = (buttonText, userList) => {

		return (<>
			{ createButton(buttonText, !isShowingFollowing) }
			<ul>
				{userList.map(user => <li key={user._id}> {user.username} </li>)}
			</ul>
		</>)
	}

	const showError = () => {
		return (<>
			{error}
		</>)
	}

  return (
		<>
			<div>
				<input type="text" name="searchBar" id="searchBar" value={searchBarText} onChange={e => setSearchBarText(e.target.value)} />
				{ followRequestPending
					? <button onClick={e => sendFollow(e)} disabled>Follow</button>
					: <button onClick={e => sendFollow(e)}>Follow</button>
				}
			</div>
			<div>
				{error && showError()}
				{ isShowingFollowing 
					?showUsers("Followers", user.following)
					:showUsers("Following", user.followers)
				}
			</div>
		</>
  )
}

export default Friends