import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTv} from '@fortawesome/free-solid-svg-icons';

function UploadVideo(props){
    
    function changeHandler(event){
       props.setVideoName(event.target.files[0].name);
       props.myVideo.src = URL.createObjectURL(event.target.files[0]);
       props.setsubText("");
       props.myVideo.textTracks[0].mode = "disabled";
       props.myVideo.load();
    }

    return (
    <div>
        <input type="file" name="file" id="file" className="inputfile" onChange={changeHandler} />
        <label for="file"><FontAwesomeIcon icon={faTv} className="fullscreen-btn" /></label>
    </div>
    );
}

export default UploadVideo;