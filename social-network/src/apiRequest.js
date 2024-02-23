import utils from "./utils"

const apiRequestHandler = () => {

  const backend = utils.getBackEnd()
  const headers = {
    'Accept': 'application/json',
    'Content-Type':'application/json'
  }

  const sendRequest = async (route, method="GET", body, auhtorizationNeedy=false) => {

      const requestHeaders = auhtorizationNeedy 
        ? {...headers, 'Authorization': `Bearer ${utils.getToken()}`}
        : headers
      
      const requestparams = method === "POST" 
      ? {headers: requestHeaders, method, body:JSON.stringify(body)}
      : {headers: requestHeaders, method, }

      const url = backend + route
    try{

      const response = await fetch(url, requestparams)
  
      const responseData = await response.json()
      
      if(!response.ok){
          throw new Error(
            `There was an HTTP Error ${response.status} handling the request`,
            {cause:responseData.errors}
          )  
      }
      return responseData
    }
    catch(e){
        throw new Error(
          e.message,
          {cause:e.cause}
        )
    }
  }

  const getFromBackend = async (route) => {
      try{
        const responseData = await sendRequest(route,"GET",{}, true)
        return responseData
      }
      catch(e){
        throw new Error(
          e.message,
          {cause:e.cause}
        )  
      }
  }
  
  const postToBackend = async (route,body) =>{
    try{
      const responseData = await sendRequest(route, "POST", body, true) 
      return responseData
    }
    catch(e){
       throw new Error(
        e.message,
        {cause:e.cause}
      )      
    }   
  }

  const putToBackend = async (route) => {
    try{
      const responseData = await sendRequest(route, "PUT", {}, true)
      return responseData
    }
    catch (e){
      throw new Error(
        e.message,
        {cause:e.cause}
      )
    }
  }

  const postSignUp = async (body) => {
    try{
      const responseData = await sendRequest("/singup", "POST", body)
      return responseData
    }
    catch (e){
      throw new Error(
        e.message,
        {cause:e.cause}
      )      
    }
  }
  
  const postLogin = async (body) => {
    try{
      const responseData = await sendRequest("/login", "POST", body)
      return responseData
    }
    catch (e){
      throw new Error (
        e.message,
        {cause:e.cause}
      )
    }
  }

  return {
      getFromBackend,
      postToBackend,
      postLogin,
      postSignUp,
      putToBackend,
    }  
}    

export default apiRequestHandler