import React,{useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";


function Request(){
    const [email,setEmail] = useState("");
    const [movie,setMovie] = useState("");
    const [show,setShow] = useState(false);
    const [reqMsg,setReqMsg] = useState("");
    function handleRequest(event){
        event.preventDefault();
        axios.post("https://leazy26.herokuapp.com/request",{email:email,movie:movie})
        .then((response)=>{
            console.log(response);
            setEmail("");
            setMovie("");
            setShow(true);
            setReqMsg("Your Feedback is submitted. Thanks for using our Website.");
            setTimeout(()=>{
              setShow(false);
            },2000);
            setTimeout(()=>{
              setReqMsg("");
            },4000);
            
        })
        .catch(()=>{
          setShow(true);
            setReqMsg("Some Error occured. Try Again");
            setTimeout(()=>{
              setShow(false);
            },2000);
            setTimeout(()=>{
              setReqMsg("");
            },4000);
        });
    }

    return (
        <div className="margin-req">
        <h3>Request Movie</h3>
        <Form onSubmit={handleRequest}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control size="sm" type="email" placeholder="Enter email" name="email" value={email} onChange={(event)=>setEmail(event.target.value)}/>
          <Form.Text>
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
      
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control size="sm" type="text" placeholder="movie name" name="movie" value={movie} onChange={(event)=>setMovie(event.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" size="sm">
          Request
        </Button>
      </Form>
      <div className={show?"req-msg req-msg-change":"req-msg"}>
          {reqMsg}
      </div>
      </div>
    );
}

export default Request;