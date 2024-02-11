import { createContext, useEffect, useState } from "react"
import Header from "../Header/Header"
import Friends from "../Friends/Friends"
import utils from "../../utils"

export const UserContext = createContext({
	user:null,
	updateUser:null,
})

const DashBoard = () => {

	const [rendering, setRendering] = useState([
		{ name:'Index', render:() => <></> },
		{name:'Friends', render:() => <Friends></Friends>},
		{name:'Notifications', render: () => <></>},
		{name:'Profile', render: () =><></>}
	]) 
	const [renderingIndex, setRenderingIndex] = useState(0)
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect( () => {
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

	const showErrors = () => {}
	const showContent = () =>{
		
		return (
			<UserContext.Provider value={{user:user, updateUser:setUser}}>
				{rendering[renderingIndex].render()}
			</UserContext.Provider>
		)
	}
	return (
    <div>
        <Header setRenderingIndex = {setRenderingIndex} contents = {rendering.map(element => element.name)} ></Header>
				{error && showErrors()}
				{!isLoading && !error && showContent()}
    </div>
  )
}

export default DashBoard