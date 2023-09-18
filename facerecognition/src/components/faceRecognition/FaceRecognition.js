import React from "react";
import './faceRecognition.css'

const FaceRecognition = ({box , imageUrl}) => {
    return(  
        <div className="center">
            <div className="absolute mt2">
                <img id='inputImage' src={imageUrl} alt="" style={{width:'500px', height: 'auto'}} />
                <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>  
    );
}

export default FaceRecognition;