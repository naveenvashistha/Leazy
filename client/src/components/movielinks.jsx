import React,{useState,useEffect} from "react";
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAnglesLeft} from '@fortawesome/free-solid-svg-icons';
import Request from "./request";
import Hls from "hls.js";
import axios from "axios";


function Movielinks(props) {
    const [show, setShow] = useState(false);
    const [errMsg,setErrMsg] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [movieLinks,setmovieLinks] = useState([]);
    const [activeLink,setActiveLink] = useState(1000);
    useEffect(()=>{
      axios.get("https://leazy26.herokuapp.com/getLinks")
      .then((response)=>{
          if(response.data.data.length !== 0){
          setErrMsg("");
          console.log(response);
          setmovieLinks(response.data.data);
        }
        else{
          setErrMsg("No active links right now");
        }
      })
      .catch((error)=>{
          setErrMsg("Something Wrong happened. Try again");
      });
    },[]);

    function playLink(i){
      props.myVideo.textTracks[0].mode = "disabled";
      props.myVideo.src = movieLinks[i].link;
      setActiveLink(i);
      props.myVideo.load();
     
      props.myVideo.onerror = function() {
            if (Hls.isSupported()) {
               console.log("i am here");
               var hls = new Hls();
               hls.loadSource(movieLinks[i].link);
               hls.attachMedia(props.myVideo);
          }
      
         }
         props.setsubText("");

      
    }
    return (
      <div>
        <FontAwesomeIcon icon={faAnglesLeft} className="link-btn" onClick={handleShow}/>
  
        <Offcanvas show={show} onHide={handleClose} placement="end" scroll = {true}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{props.topic}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h3>Available Links</h3>
            {errMsg.length !==0?<p>{errMsg}</p>:null}
            <ListGroup>
            {movieLinks.map((ele,i)=>{
              return (<ListGroup.Item onClick={()=>playLink(i)} className={activeLink === i?"activelink":null}>{ele.name}</ListGroup.Item>);
            })}
            </ListGroup>
            <Request />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    );
  }

  export default Movielinks;