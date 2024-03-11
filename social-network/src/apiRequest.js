import utils from "./utils"


  const sendRequest = async (route, method="GET", body, auhtorizationNeedy=false) => {
    
      const headers = {
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    
      const requestHeaders = auhtorizationNeedy 
        ? {...headers, 'Authorization': `Bearer ${utils.getToken()}`}
        : headers
      
      const requestparams = method !== "GET" 
      ? {headers: requestHeaders, method, body:JSON.stringify(body)}
      : {headers: requestHeaders, method, }

      const url = utils.getBackEnd() + route
    try{

      console.log(requestparams);
      const response = await fetch(url, requestparams)
  
      const responseData = await response.json()
      
      if(!response.ok){
          throw new Error(
            `There was an HTTP Error ${response.status} handling the request`,
            {cause:responseData.error 
              ? responseData.error.msg
              : responseData.errors
            }
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

  const putToBackend = async (route, data = {}) => {
    try{
      console.log(data);
      const responseData = await sendRequest(route, "PUT", data, true)
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

export default    {   
      getFromBackend,
      postToBackend,
      postLogin,
      postSignUp,
      putToBackend,
    }  
