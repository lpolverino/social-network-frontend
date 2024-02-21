import { createContext, useEffect, useState } from "react"
import Header from "../Header/Header"
import Friends from "../Friends/Friends"
import PostDisplayer from "../PostsDisplayer/PostDisplayer"
import Profile from "../Profile/Profile"
import Notification from "../Notification/Notification"
import utils from "../../utils"
import {socket} from "../../socket"

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
		{name:'Profile', render: () =><Profile></Profile>}
	]) 
	const [renderingIndex, setRenderingIndex] = useState(0)
	const [isConnected ,setIsConnected] = useState(socket.connected)

	useEffect( () => {
		console.log("gerUser");
		const getUser = async () =>{
			console.log("retrieving data");
			const backendUrl = utils.getBackEnd() +"/users/" + utils.getuser() + "/profile"
			try{
				const response = await fetch(backendUrl, {
					headers:{
						'Accept': 'application/json',
					'Authorization':`Bearer ${utils.getToken()}`,
					}
				});
				
				const responseData = await response.json()
				if(!response.ok){
					setError(`There was a HTTP ERROR ${response.status} Message error is ${responseData.error.msg}`)
					return
				}
				utils.setUserDetails(responseData.user)
				setUser(responseData.user)
			}
			catch(e){
				console.log(e);
				setError(e)
			}
			finally{
				setIsLoading(false)
			}
		}
		const userDetails = utils.getUserDetails()
		console.log(userDetails);
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

	const showErrors = () => {}
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