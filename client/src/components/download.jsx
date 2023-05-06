import React,{useState} from "react";
import axios from 'axios';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form, ListGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

function Download(){
   const [downloadText,setdownloadText] = useState("");
   const [waiting,setWaiting] = useState("");
   const [link,setLink] = useState([]);
   const [dMsg,setdMsg] = useState("");
   const [movieBoxState,setmovieBoxState] = useState(false);
   const [langBoxState,setlangBoxState] = useState(false);
    async function search(event){
        event.preventDefault();
        console.log(downloadText);
        setWaiting("Searching Movie .... ");
        setdMsg("");
        setmovieBoxState(false);
        setlangBoxState(false);
        axios.post("https://leazy26.herokuapp.com/searchMovie",{subtitle:downloadText})
        .then((response)=>{
            console.log(response);
            setWaiting("");
            if (response.data.data.length !== 0){
            setLink(response.data.data);
            setmovieBoxState(true);
            }
            else{
                setdMsg("No Results");
            }
        })
        .catch((error)=>{
            setWaiting("");
            console.log(error);
            setdMsg("Some error occurred. Try again ");
        });
    }

    function getLanguage(i){
       setWaiting("getting the languages .... ");
       setmovieBoxState(false);
       axios.post("https://leazy26.herokuapp.com/selectLanguage",{movieChoice:link[i].link})
       .then((response)=>{
        setWaiting("");
        if(response.data.data.length!==0){
        console.log(response);
        setlangBoxState(true);
        setLink(response.data.data);
        }
        else{
            setdMsg("Some Error occurred");
        }
    })
    .catch((error)=>{
        setWaiting("");
        console.log(error);
        setdMsg("Some error occurred");
    });
    }

    function getSubtitle(i){
        setWaiting("downloading ....");
        setlangBoxState(false);
        axios.post("https://leazy26.herokuapp.com/downloadLink",{langChoice:link[i].link})
       .then((response)=>{
        setWaiting("");
        if (response.data.data.length !== 0){
        console.log(response);
        window.open(response.data.data);
        }
        else{
            setdMsg("Error Occurred. Can't Download.");
        }
    })
    .catch((error)=>{
        setWaiting("");
        setdMsg("Some error occurred");
        console.log(error);
    });
    }


    return (
    <Row className="row-content margin-above">
    <Col sm={9} xs={9} className="main-box no-padding">
        <Form onSubmit={search}>
        <Form.Control placeholder="Search Subtitle" size="sm" type="text" name="download" onChange={(event)=>setdownloadText(event.target.value)} />
        <Button size="sm" type="submit" className="play-btn"><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
        </Form>
        {movieBoxState?<ListGroup>
            {link.map((element,i)=>{
                return <ListGroup.Item onClick={()=>getLanguage(i)}>{element.name + " ( " + element.details + " )"}</ListGroup.Item>
            })}
        </ListGroup>:null}
        {langBoxState?<ListGroup>
            {link.map((element,i)=>{
                return <ListGroup.Item onClick={()=>getSubtitle(i)}>{element.rating}: {element.lang}</ListGroup.Item>
            })}
        </ListGroup>:null}
        {waiting.length !== 0?<p className="subtitle-msg">{waiting}</p>:null}
        {dMsg.length !==0?<p className="subtitle-msg">{dMsg}</p>:null}
        </Col>
    </Row>
    );
}

export default Download;