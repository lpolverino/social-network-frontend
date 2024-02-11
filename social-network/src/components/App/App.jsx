import { useState } from "react"
import { Navigate } from "react-router-dom";
import utils from "../../utils";
import DashBoard from "../DashBoard/DashBoard";

function App() {
  const [isLogged, setIsLogged] = useState(utils.isLogged())

  return (
    <>
    {isLogged
      ? <DashBoard></DashBoard>
      :<Navigate to="/login" replace={true} />
    }
   </>
  )
}

export default App
