import { useContext, useState } from "react"
import { UserContext } from "../DashBoard/DashBoard"
import utils from "../../utils"
import apiRequest  from "../../apiRequest"
import { NavLink } from "react-router-dom"
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer"

const Friends = () => {

	const [isShowingFollowing, setIsShowingFollowing] = useState(true)
	const [searchBarText, setSearchBarText] = useState('')
	const [followRequestPending, setFollowRequestPending] = useState(false)
	const [error,setError] = useState(null)

	const {user, updateUser, socket} = useContext(UserContext)

	const sendFollow = async (e,userToFollow) => {
		e.preventDefault()
		setFollowRequestPending(true)
		const backendUrl = "/users/" + utils.getuser() +"/follow"
		try{
			const responseData = await apiRequest.postToBackend(backendUrl,{username:userToFollow})

			const newUser = {
				...user,
				following : user.following.concat([responseData.followedUser])
			}
			updateUser(newUser)

			socket.emit("notify",responseData.followedUser._id)
		}
		catch(e){
			console.log(e);
			setError(utils.parseError(e))
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

	const showPendings = () =>{
		const following = user.following
		const followers = user.followers
		
		const difference = (a,b) => {
			return a.filter(element => {
					const match = b.filter(user => user._id === element._id)
					console.log(match);
					return match.length === 0
			})
		}

		const pending =  Array.from(difference(followers,following))
		console.log(pending);
		
		const createPendingUser = (pendingUser) =>{
			return (<li key={pendingUser._id}>
				<p>
					<NavLink to={"/profile/"+pendingUser._id}> 
						{pendingUser.username}
					</NavLink>
				</p>
				<button onClick={(e) => sendFollow(e, pendingUser.username)}> Accept </button>
				<button> Ignore </button>
			</li>)
		}
		
		return (<>
			<h2> Pending</h2>
			<ul>
				{pending.map(pendingUser => createPendingUser(pendingUser))}
			</ul>
		</>)
	}

	const showError = () => {
		return <ErrorDisplayer errors={[error]}> </ErrorDisplayer>
	}

  return (
		<>
			<div>
				<input type="text" name="searchBar" id="searchBar" value={searchBarText} onChange={e => setSearchBarText(e.target.value)} />
				{ followRequestPending
					? <button disabled>Follow</button>
					: <button onClick={e => sendFollow(e, searchBarText)}>Follow</button>
				}
			</div>
			<div>
				{error && showError()}
				{showPendings()}
				<h2>{isShowingFollowing? "Following": "Followers"}</h2>
				{ isShowingFollowing 
					?showUsers("Followers", user.following)
					:showUsers("Following", user.followers)
				}
			</div>
		</>
  )
}

export default Friends