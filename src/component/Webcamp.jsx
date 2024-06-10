import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { runModelUtil } from "../pages/utilities";
import { Tensor } from "onnxruntime-web";
import Footer from "./Footer";

const WebcamComponent = (props) => {
  const [inferenceTime, setInferenceTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const webcamRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const liveDetection = useRef(false);
  const originalSize = useRef([0, 0]);
  const [facingMode, setFacingMode] = useState("environment");
  const [SSR, setSSR] = useState(true);

  const capture = () => {
    const canvas = videoCanvasRef.current;
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (facingMode === "user") {
      context.setTransform(-1, 0, 0, 1, canvas.width, 0);
    }

    context.drawImage(
      webcamRef.current.video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (facingMode === "user") {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
    return context;
  };

  const runModel = async (ctx) => {
    const data = props.preprocess(ctx);
    // console.log(data)
    let outputTensor;
    let inferenceTime;
    if(props.session && data) {
      [outputTensor, inferenceTime] = await runModelUtil(
        props.session,
        data
      );
    }

    props.postprocess(outputTensor, props.inferenceTime, ctx);
    setInferenceTime(inferenceTime);
  };

  const runLiveDetection = async () => {
    if (liveDetection.current) {
      liveDetection.current = false;
      return;
    }
    liveDetection.current = true;
    while (liveDetection.current) {
      const startTime = Date.now();
      const ctx = capture();
      if (!ctx) return;
      await runModel(ctx);
      setTotalTime(Date.now() - startTime);
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    }
  };

  const processImage = async () => {
    reset();
    const ctx = capture();
    if (!ctx) return;

    // create a copy of the canvas
    const boxCtx = document.createElement("canvas").getContext("2d");
    boxCtx.canvas.width = ctx.canvas.width;
    boxCtx.canvas.height = ctx.canvas.height;
    boxCtx.drawImage(ctx.canvas, 0, 0);

    await runModel(boxCtx);
    ctx.drawImage(boxCtx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const reset = async () => {
    var context = videoCanvasRef.current.getContext("2d");
    context.clearRect(0, 0, originalSize.current[0], originalSize.current[1]);
    props.resetText()
    liveDetection.current = false;
  };

  const setWebcamCanvasOverlaySize = () => {
    const element = webcamRef.current.video;
    if (!element) return;
    var w = element.offsetWidth;
    var h = element.offsetHeight;
    var cv = videoCanvasRef.current;
    if (!cv) return;
    cv.width = w;
    cv.height = h;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        liveDetection.current = false;
      }
      setSSR(document.hidden);
    };
    setSSR(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (SSR) {
    return <div>Loading...</div>;
  }

  return (
    <>
       <div className="flex flex-col items-center w-full">
  <div
    id="webcam-container"
    className="flex items-center justify-center webcam-container relative"
  >
    <Webcam
      mirrored={facingMode === "user"}
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      imageSmoothing={true}
      videoConstraints={{
        facingMode: facingMode,
      }}
      onLoadedMetadata={() => {
        setWebcamCanvasOverlaySize();
        originalSize.current = [
          webcamRef.current.video.offsetWidth,
          webcamRef.current.video.offsetHeight,
        ];
      }}
      forceScreenshotSourceSize={true}
    />
    <canvas
      id="cv1"
      ref={videoCanvasRef}
      style={{
        position: "absolute",
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0)",
      }}
    ></canvas>
  </div>
  <div className="flex flex-col justify-center items-center">

    <div className="flex px-[1em] py-[1em] justify-between bg-violet-400 w-full text-white">
            <div>
              <div>
                  Total FPS
              </div>
              <div>
                  {(1000 / inferenceTime).toFixed(2) + " fps"}
              </div>
            </div>
            <div>
              <div>
                  Total Time
              </div>
              <div>
                  {totalTime.toFixed() + "ms"}
              </div>
            </div>
            <div>
              <div>
                  Overhead Fps
              </div>
              <div>
              {(1000 * (1 / totalTime - 1 / inferenceTime)).toFixed(2) + " fps"}
              </div>
            </div>
      </div>
      <div className="flex mt-[1em]  flex-wrap w-80 h-20 overflow-y-scroll border">
        {props.texts}
      </div>
      <div className="flex gap-1 flex-wrap justify-center items-center m-5">
      <div className="flex gap-1 justify-center items-center">
        <button
          onClick={async () => {
            if (liveDetection.current) {
              liveDetection.current = false;
            } else {
              runLiveDetection();
            }
          }}
          className={`p-2 border-dashed border-2 rounded-xl hover:translate-y-1 ${
            liveDetection.current ? "bg-violet-500 text-white" : ""
          }`}
        >
          Live Detection
        </button>
      </div>
      <div className="flex gap-1 justify-center items-center">
        <button
          onClick={() => {
            reset();
            setFacingMode(facingMode === "user" ? "environment" : "user");
          }}
          className="p-2 border-dashed border-2 rounded-xl hover:translate-y-1"
        >
          Switch Camera
        </button>
    
        <button
          onClick={reset}
          className="p-2 border-dashed border-2 rounded-xl hover:translate-y-1"
        >
          Reset
        </button>
      </div>
    </div>
    
    {/* <div>Using {props.modelName}</div>
    <div className="flex gap-3 flex-wrap justify-between items-center px-5 w-full">
      <div>
        {"Model Inference Time: " + inferenceTime.toFixed() + "ms"}
        <br />
        {"Total Time: " + totalTime.toFixed() + "ms"}
        <br />
        {"Overhead Time: +" + (totalTime - inferenceTime).toFixed(2) + "ms"}
      </div>
      <div>
        <div>{"Model FPS: " + (1000 / inferenceTime).toFixed(2) + "fps"}</div>
        <div>{"Total FPS: " + (1000 / totalTime).toFixed(2) + "fps"}</div>
        <div>
          {"Overhead FPS: " +
            (1000 * (1 / totalTime - 1 / inferenceTime)).toFixed(2) +
            "fps"}
        </div>
      </div>
    </div> */}
  </div>
</div>
    <Footer />

    </>
   
  );
};

export default WebcamComponent
