import { createContext, useEffect, useState } from "react"
import Header from "../Header/Header"
import utils from "../../utils"
import { socket } from "../../socket"
import { Outlet } from "react-router-dom"
import apiRequest from "../../apiRequest"
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer"

export const UserContext = createContext({
	user:null,
	updateUser:null,
	socket: null,
})

const DashBoard = () => {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	const [rendering, setRendering] = useState([
		{name:'Home',link:'index'},
		{name:'followers',link:'followers'},
		{name:'notifications', link:'notifications', alert:false},
		{name:'profile', link:`profile/${utils.getuser()}`}
	]) 

	const [isConnected ,setIsConnected] = useState(socket.connected)
	
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

	useEffect( () => {
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
			console.log(data);
			alert(data)
			getUser()
			const newHeaders = rendering.map(element => {
				return element.alert !== undefined 
					?{...element, alert:true}
					:element
				})
			setRendering(newHeaders)
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
				<Outlet></Outlet>
			</UserContext.Provider>
		)
	}


	return (
    <div>
        <Header contents = {rendering} ></Header>
				{error && showErrors()}
				{!isLoading && !error  && showContent()}
    </div>
  )
}

export default DashBoard