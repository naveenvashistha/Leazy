import React,{useState,useRef,useEffect} from "react";
import Hls from "hls.js";
import LinkField from "./linkInput";
import Meaning from "./meaning";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExpand} from '@fortawesome/free-solid-svg-icons';
import "./styles.css";
import UploadVideo from "./upload-video";
import UploadSubtitle from "./upload-subtitle";
import Download from "./download.jsx";
import Movielinks from "./movielinks.jsx";
import Msg from "./msg";
import Footer from "./footer";
import Heading from "./heading";
const _ = require("lodash");

function Video(){
   const [subName,setSubName] = useState("");
   const [msg,setmsg] = useState("");
   const [videoName,setVideoName] = useState("");
   const subRef = useRef();
   const myVideo = useRef();
   const mainBox = useRef();
   const screen = useRef(false);
   const [show, setShow] = useState(false);
   const [position,setPosition] = useState();
   const [wordMeaning,setwordMeaning] = useState([]);
   const target = useRef(null);
   const [screenHeight,setScreenHeight] = useState("video-box");
   const [Video,setVideo] = useState();
   const [subtitle,setSubtitle] = useState();
   const [subText,setsubText] = useState("");
   const [selectSubText,setselectSubText] = useState("");
   useEffect(() => {
       setVideo(myVideo.current);
       setSubtitle(subRef.current);
       myVideo.current.textTracks.onchange = (event)=>{
           if(event.target[0].mode === "disabled"){
              setShow(false);
              setsubText("");
           }
       }

       myVideo.current.addEventListener("play",()=>{
          setShow(false);
       });

       document.addEventListener("webkitfullscreenchange", function(e) {
          if (document.fullscreenElement && document.fullscreenElement.tagName === "VIDEO"){
            
            screen.current = true;
            myVideo.current.setAttribute("controlsList","nofullscreen");
            setScreenHeight("video-box");
            document.webkitExitFullscreen();
          }
          else if (screen.current === true){
            screen.current = false;
            setShow(false);
            document.webkitExitFullscreen();
          }
          if (document.fullscreenElement === null){
            setShow(false);
            setScreenHeight("video-box");
            myVideo.current.setAttribute("controlsList","nofullscreen");
          }
       });
      

      subRef.current.addEventListener("cuechange",(event)=>{
         
         if (event.target.track.activeCues.length > 0){
         setsubText(event.target.track.activeCues[0].text);
         }
         else{
            setsubText("");
         }
      });
       
    }, []);
   
   function goFullScreen(){
      myVideo.current.setAttribute("controlsList","");
      setScreenHeight("fullscreen-height");
      setShow(false);
      mainBox.current.webkitRequestFullscreen();
      
   }

   function linkButton(link,setLink){
      myVideo.current.src = link;
      myVideo.current.textTracks[0].mode = "disabled";
      myVideo.current.load();
     
      myVideo.current.onerror = function() {
            if (Hls.isSupported()) {
               console.log("i am here");
               var hls = new Hls();
               hls.loadSource(link);
               hls.attachMedia(myVideo.current);
          }
      
         }
         setLink("");
         setsubText("");

      }

   
   function textSelect(){
      if(myVideo.current.paused){
      let text = window.getSelection();
      console.log(_.trim(text.toString()).split(" "));
      if (_.trim(text.toString()).split(" ").length === 1 && _.trim(text.toString()).split(" ")[0] !== ""){
         axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/'+_.trim(text.toString()))
         .then(results=>{
             setwordMeaning(results.data[0].meanings[0].definitions[0].definition);
             setPosition([target.current.getBoundingClientRect(),mainBox.current.getBoundingClientRect()]);
             setselectSubText(_.trim(text.toString()));
             setShow(true);
            })
            .catch((error)=>{
                setwordMeaning("No definition found");
                setPosition([target.current.getBoundingClientRect(),mainBox.current.getBoundingClientRect()]);
                setselectSubText(_.trim(text.toString()));
                setShow(true);
            });
     }
   }
}

   return (
      <div className="main-box">
      <Heading />
      <Movielinks
         myVideo = {Video}
         setsubText = {setsubText}
      />
       <LinkField
          linkButton = {linkButton}
       />

      <Row className="row-content">
      <Col sm={9} xs={9} className="main-box no-padding" ref={mainBox}>
      <video controls preload="metadata" className={screenHeight} ref={myVideo} controlsList = "nofullscreen">
       
       <track src={process.env.PUBLIC_URL + "/test.vtt"} kind="subtitles" srcLang="en" label="English" ref={subRef}></track>
    </video>
    <div className="overlay" ref={target} onMouseUp={textSelect} onCopy={textSelect}>
       {subText}
    </div>
    {show?
    <Meaning
       show = {show}
       wordMeaning = {wordMeaning}
       setShow = {setShow}
       selectSubText = {selectSubText}
       position = {position}
    />:null}
    </Col>
    </Row>
    <Row className="row-content">
    <Col sm={9} xs={9} className="no-padding row-content-space-between">
    <div onClick={goFullScreen}><FontAwesomeIcon icon={faExpand} className="fullscreen-btn" /></div>
    <UploadVideo
       myVideo = {Video}
       setsubText = {setsubText}
       setVideoName = {setVideoName}
    />
    <UploadSubtitle
       myVideo = {Video}
       subRef = {subtitle}
       setsubText = {setsubText}
       setSubName = {setSubName}
       setmsg = {setmsg}
    />
    </Col>
    </Row>
    <Msg 
       msg={msg}
       subName={subName}
       videoName={videoName}
    />
    <Download />
    <Footer />
    </div>
   );
}

export default Video;