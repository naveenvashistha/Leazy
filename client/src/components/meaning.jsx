import React,{useEffect,useRef,useState} from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
function Meaning(props){
    const tooltip = useRef();

    const [height,setHeight] = useState(0);
    useEffect(()=>{
        setHeight(tooltip.current.offsetHeight);       
    },[props.selectSubText]);
    
    function handleClick(){
        props.setShow(false);
    }
    
   return (
        <div>
                    <Tooltip id="overlay-example" ref={tooltip} placement="top" style={{top:props.position[0].top - props.position[1].top - height}}>
                            <p className="meaning">{props.wordMeaning}</p>        
                            <FontAwesomeIcon icon={faXmark} className="cancel-meaning-icon" onClick={handleClick}/>             
                    </Tooltip>
                    
        </div>
       
   );
}

export default Meaning; 

