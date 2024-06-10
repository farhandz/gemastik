import React,  { useRef, useEffect, useCallback } from 'react'
import Navbar from '../component/Navbar'
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import Footer from '../component/Footer'
import {drawRect} from "./utilities"; 
import { nextFrame } from "@tensorflow/tfjs";



function Kamera() {
const webcamRef = useRef(null);
const canvasRef = useRef(null);

// Main function
const runCoco = async () => {
  // 3. TODO - Load network 
  // e.g. const net = await cocossd.load();
  // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json
  const weight = [
    '/group1-shard1of11.bin',
    '/group1-shard2of11.bin',
    '/group1-shard3of11.bin',
    '/group1-shard4of11.bin',
    '/group1-shard5of11.bin',
    '/group1-shard6of11.bin',
    '/group1-shard7f11.bin',
    '/group1-shard8of11.bin',
    '/group1-shard9of11.bin',
    '/group1-shard10of11.bin',

  ]
  const net = await tf.loadGraphModel('/bisindov2_web_model/model.json')
  
  //  Loop and detect hands
  setInterval(() => {
    detect(net);
  }, 30);
};

const detect = async (net) => {
  // Check data is available
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  ) {
    // Get Video Properties
    const video = webcamRef.current.video;
    const videoWidth = 640;
    const videoHeight = 640;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = 640;
    canvasRef.current.height = 640;

    console.log(video)
    // 4. TODO - Make Detections
    const img = tf.browser.fromPixels(video)
    const resized = tf.image.resizeBilinear(img, [640,640])
    const casted = resized.cast('float32')
    const expanded = casted.expandDims(0)
    const obj = await net.executeAsync(expanded)
    const tt = await net.executeAsync(expanded).then(predictions=> { 
      const data = predictions.dataSync() // you can also use arraySync or their equivalents async methods
      return data;
    })
    
    console.log(tt)
    const [batch, numDetections, dataLength] = obj.shape;

    const reshaped = obj.reshape([numDetections, dataLength]).arraySync();
    const boxes = [];
const scores = [];
const classes = [];
const numClasses = 36;

for (let i = 0; i < numDetections; i++) {
  const detection = reshaped[i];
  const box = detection.slice(0, 4); // Assuming the first 4 values are the box coordinates
  const score = detection[4]; // Assuming the 5th value is the score
  const classScores = detection.slice(5, 5 + numClasses); // Assuming the remaining are class scores

  const classIndex = classScores.indexOf(Math.max(...classScores)); // Get the index of the highest score

  boxes.push(box);
  scores.push(score);
  classes.push(classIndex);
}

  // Optionally, filter out low-confidence detections
const confidenceThreshold = 100;
const detectionBoxes = [];
const detectionScores = [];
const detectionClasses = [];

for (let i = 0; i < scores.length; i++) {
  if (scores[i] > confidenceThreshold) {
    detectionBoxes.push(boxes[i]);
    detectionScores.push(scores[i]);
    detectionClasses.push(classes[i]);
  }
}


console.log(detectionBoxes, 'box')
// console.log(detectionScores, 'score')
// console.log(detectionClasses, 'class')



    // Draw mesh
    const ctx = canvasRef.current;

    console.log(ctx)

    // 5. TODO - Update drawing utility
    // drawSomething(obj, ctx)  
    
    // drawRect(canvasRef, detectionBoxes, detectionClasses, detectionScores );
    requestAnimationFrame(()=>{drawRect(canvasRef, detectionBoxes, detectionClasses, detectionScores );}); 

    tf.dispose(img)
    tf.dispose(resized)
    tf.dispose(casted)
    tf.dispose(expanded)
    tf.dispose(obj)

  }
};

useEffect(()=>{runCoco()},[]);

return (
  <div className="App">
    <header className="App-header">
   (
  <div className="App">
    <header className="App-header">
      <Webcam
        ref={webcamRef}
        muted={true} 
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 640,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 8,
          width: 640,
          height: 640,
        }}
      />
    </header>
  </div>
);


    </header>
  </div>
);


}


export default Kamera