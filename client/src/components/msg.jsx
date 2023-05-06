import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Msg(props){
   return (
      <Row>
          <Col sm={4} xs={4} className="upload-style">
             <p></p>
          </Col>
          <Col sm={4} xs={4} className="upload-style">
              {props.videoName.length !==0?<p>{props.videoName.slice(0,10)+"....."}</p>:null}
          </Col>
          <Col sm={4} xs={4} className="upload-style">
          {props.msg.length !== 0?<p>{props.msg}</p>:props.subName.length !==0?<p>{props.subName.slice(0,10)+"....."}</p>:null}
          </Col>
      </Row>
   );
}

export default Msg;