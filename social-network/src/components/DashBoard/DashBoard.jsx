import { createContext, useEffect, useState } from "react"
import Header from "../Header/Header"
import Friends from "../Friends/Friends"
import PostDisplayer from "../PostsDisplayer/PostDisplayer"
import Notification from "../Notification/Notification"
import utils from "../../utils"
import {socket} from "../../socket"
import { Navigate } from "react-router-dom"
import apiRequest from "../../apiRequest"
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer"

export const UserContext = createContext({
	user:null,
	updateUser:null,
	socket: null
})

const DashBoard = () => {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	const [rendering, setRendering] = useState([
		{ name:'Index', render:() => <PostDisplayer></PostDisplayer> },
		{name:'Friends', render:() => <Friends></Friends>},
		{name:'Notification', render:() => <Notification></Notification>},
		{name:'Profile', render: () =><Navigate to={"/profile/"+utils.getuser()} replace={true}></Navigate>}
	]) 
	const [renderingIndex, setRenderingIndex] = useState(0)
	const [isConnected ,setIsConnected] = useState(socket.connected)

	useEffect( () => {
		const getUser = async () =>{
			const backendUrl = "/users/" + utils.getuser() + "/profile"
			try{
				const userRequestData = await apiRequest.getFromBackend(backendUrl)
				utils.setUserDetails(userRequestData.user)
				setUser(userRequestData.user)
			}
			catch(e){
				console.log(e);
				setError(utils.parseError(e))
			}
			finally{
				setIsLoading(false)
			}
		}
		const userDetails = utils.getUserDetails()
		!userDetails
		? getUser()
		:	setUser(userDetails)
	},[])

	useEffect(() => {
		utils.setUserDetails(JSON.stringify(user))
	}, [user])
	
	useEffect( () => {
		socket.on("notification", (data) => {
			alert(data)
		})
	}, [socket])
	
	useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

		socket.emit("username",utils.getuser())

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

	const showErrors = () => {
		return <ErrorDisplayer errors={[error]}></ErrorDisplayer>
	}
	const showContent = () =>{

		return (
			<UserContext.Provider value={{user:user, updateUser:setUser, socket:socket}}>
				{rendering[renderingIndex].render()}
			</UserContext.Provider>
		)
	}

	const sections = rendering.map( el => {
		const sectionToRender = {
			content:el.name
		}
		if(el.name === "Notification"){	
			sectionToRender.alert =  user!== null ? user.notifications.unread : false
		}
		return sectionToRender
	});

	return (
    <div>
        <Header setRenderingIndex = {setRenderingIndex} contents = {sections} ></Header>
				{error && showErrors()}
				{!isLoading && !error  && showContent()}
    </div>
  )
}

export default DashBoard