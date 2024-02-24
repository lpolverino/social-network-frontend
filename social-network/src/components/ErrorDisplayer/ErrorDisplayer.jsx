import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import {v4 as uuidv4} from "uuid"

const ErrorDisplayer = ({errors}) => {

  console.log(errors);

  const [errorWithId, setErrorsWithId] = useState([])

  useEffect(() => {
    const newErros = errors.map(error => { 
      
      const getNewCauses = (errorCauses) => {
        if(typeof error.cause !== "string"){
          return error.cause.map(errorCause => {
              return {
                text:errorCause.error.msg,
                id: uuidv4()
              }
            })
        }
        return  errorCauses
      }
      
      const newCauses = error.cause && getNewCauses(error.cause)
      
      return {
        id: uuidv4(),
        msg:error.msg,
        cause: newCauses 
      }      
    })
    setErrorsWithId(newErros)
  },[errors])
  
  const createErrorCause = (errorCause) => {

    return (
      <li key={errorCause.id}>
        {errorCause.text}
      </li>
    )
  }

  const createError = (error) => {
    return (
      <div key={error.id}>
        <h3>{error.msg}</h3>
        <ul>
          { typeof error.cause === "string" ?
          <li key={error.cause}>
            {error.cause}
          </li>
          : error.cause && error.cause.map(errorCause => createErrorCause(errorCause))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {errorWithId.map(error => createError(error))}
    </div>
  )
}

ErrorDisplayer.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({
    msg:PropTypes.string,
    cause:PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  })).isRequired
}

export default ErrorDisplayer