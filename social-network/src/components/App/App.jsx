import { useState } from "react"
import { Navigate } from "react-router-dom";
import utils from "../../utils";

function App() {
  const [isLogged, setIsLogged] = useState(utils.isLogged())

  return (
    <>
    {isLogged
      ? <p>Logged</p>
      :<Navigate to="/login" replace={true} />
    }
   </>
  )
}

export default App
