import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faVideo} from '@fortawesome/free-solid-svg-icons';

function LinkField(props){
   const [link,setLink] = useState("");
   return (
       <Row className="row-content margin-above-below">
        <Col sm={9} xs={9} className="main-box no-padding">
          <Form.Control size="sm" type="text" placeholder="Movie Link" value={link} onChange={(event)=>setLink(event.target.value)} />
          <Button size="sm" onClick = {()=>props.linkButton(link,setLink)} className="play-btn"><FontAwesomeIcon icon={faVideo} /></Button>
        </Col>
        
         
       </Row>
   );
}

export default LinkField;