import React from "react";
import toWebVTT from "srt-webvtt";
import * as zip from "@zip.js/zip.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClosedCaptioning} from '@fortawesome/free-solid-svg-icons';

function UploadSubtitle(props){
  
  async function srttovtt(blob){
    const textTrackUrl = await toWebVTT(blob);
    props.subRef.src = textTrackUrl;
    props.setsubText("");
    props.myVideo.textTracks[0].mode = "disabled";
    props.setmsg("");
  }
    function getExtension(filename){
           let letter = "";
           for (var i=filename.length-1;i>=0;i--){
               letter += filename[i];
               if (filename[i] === "."){
                 break;
               }
           }
           return letter;
    }
   
    async function changeHandler(event){
        try {
           const name = event.target.files[0].name;
           let letter = getExtension(name);
           if (letter === "piz."){
              const reader = new zip.ZipReader(new zip.BlobReader(event.target.files[0]));
              console.log(event.target.files[0]);
              const entries = await reader.getEntries();
              if (entries.length) {
                letter = getExtension(entries[0].filename);
                if(letter === "trs." || letter === "ttv."){
                 console.log(entries);
                 const text = await entries[0].getData(new zip.TextWriter());
                 var blob = new Blob([text], {type:'text/plain'});
                 props.setSubName(event.target.files[0].name);
                 srttovtt(blob);
                }
                else{
                  props.setmsg("wrong type file in zip folder. try again.");
                }
              }
              else{
                 props.setmsg("zip file is empty. try again.");   
              }
               await reader.close();
           }
           else if(letter === "trs." || letter === "ttv."){
             props.setSubName(event.target.files[0].name);
              srttovtt(event.target.files[0]);
           }
           else{
             props.setmsg("use zip, srt or vtt type of files. Try again.");
           }
          } catch (e) {
            console.error(e.message);
            props.setmsg("some error occured. Try again.");
          }
       
    }

    return (
    <div>
        <input type="file" name="file1" id="file1" className="inputfile" onChange={changeHandler} />
        <label for="file1"><FontAwesomeIcon icon={faClosedCaptioning} className="fullscreen-btn" /></label>    
    </div>
    );
}

export default UploadSubtitle;