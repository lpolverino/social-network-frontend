const isLogged = () =>{
    const login =  getToken()
    console.log(login !== null && login !== undefined);
    console.log(login);
    return login !== null && login !== undefined
}

const getBackEnd = () =>{
    return "http://localhost:3002"
}

const setToken = (tokenValue) =>{
    window.sessionStorage.setItem('token', tokenValue)
}

const setUser = (userValue) =>{
    window.sessionStorage.setItem('user', userValue)
}

const getuser = () =>{
    return window.sessionStorage.getItem('user')
}

const getToken = () =>{
    return window.sessionStorage.getItem('token')
}

const getAnonymusUser = () =>{
    return {anonymusUsername:"Tyree14", anonymusPassword:"pPM_uJYeILgR2v4"}
}

const setUserDetails = (userDetails) => {
    window.sessionStorage.setItem('userDetails', userDetails)
}

const getUserDetails = () =>{
    const userDetails = window.sessionStorage.getItem("userDetails")
    if(userDetails === 'undefined') return undefined
    return JSON.parse(userDetails)
}
export default  {
    isLogged,
    getBackEnd,
    setToken,
    getToken,
    getAnonymusUser,
    setUser,
    getuser,
    setUserDetails,
    getUserDetails,
}