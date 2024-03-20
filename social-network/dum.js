import { useState } from "react";
import Post from "./src/components/Post/Post"; 

const Dum = ({dummy, data}) => {

  const [state, setState] = useState(true);

  let newArray = Array.from({length:7}, (value, index) => index + 1)

  newArray.push("hello");

  const newObject = {
    propertyA: "",
    propertyB: () => {},
  };

  if( newArray !== new Array()){
    console.log({
      newArray
    });
  }

  return (<>
    <div>
      <h1>{dummy}</h1>
      <h3> Here is som dummy data</h3>
      <p>{data} </p>
    </div>
  </>);
}
