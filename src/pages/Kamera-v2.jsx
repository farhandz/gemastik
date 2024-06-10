import React, { useState, useEffect } from 'react';
import ndarray from 'ndarray';
import { Tensor } from 'onnxruntime-web';
import ops from 'ndarray-ops';
// import ObjectDetectionCamera from '../ObjectDetectionCamera';
import { round } from 'lodash';
import { createModelCpu } from './utilities';
import { yoloClasses } from './utilities';
// import { runModelUtils } from '../../utils';
import onnx from "./bisindov2.onnx";
import WebcamComponent from '../component/Webcamp';

const RES_TO_MODEL = [
  [[256, 256], onnx],
];

const Kamera = () => {
  const [modelResolution, setModelResolution] = useState(RES_TO_MODEL[0][0]);
  const [modelName, setModelName] = useState(RES_TO_MODEL[0][1]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const session = await createModelCpu(
        onnx
      );
      console.log(session)
      setSession(session);
    };
    getSession();
  }, [modelName]);

  const changeModelResolution = () => {
    const index = RES_TO_MODEL.findIndex((item) => item[0] === modelResolution);
    if (index === RES_TO_MODEL.length - 1) {
      setModelResolution(RES_TO_MODEL[0][0]);
      setModelName(RES_TO_MODEL[0][1]);
    } else {
      setModelResolution(RES_TO_MODEL[index + 1][0]);
      setModelName(RES_TO_MODEL[index + 1][1]);
    }
  };

  const resizeCanvasCtx = (
    ctx,
    targetWidth,
    targetHeight,
    inPlace = false
  ) => {
    let canvas;

    if (inPlace) {
      canvas = ctx.canvas;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.scale(
        targetWidth / canvas.clientWidth,
        targetHeight / canvas.clientHeight
      );
    } else {
      canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      canvas
        .getContext('2d')
        .drawImage(ctx.canvas, 0, 0, targetWidth, targetHeight);

      ctx = canvas.getContext('2d');
    }
    

    return ctx;
  };

  const preprocess = (ctx) => {
    const resizedCtx = resizeCanvasCtx(
      ctx,
      modelResolution[0],
      modelResolution[1]
    );
    
    
    console.log(resizedCtx.getImageData())

    const imageData = resizedCtx.getImageData(
      0,
      0,
      modelResolution[0],
      modelResolution[1]
    );
    const { data, width, height } = imageData;
    

    const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
    // console.log(data)
    const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
      1,
      3,
      width,
      height,
    ]);

    console.log(dataProcessedTensor)

    ops.assign(
      dataProcessedTensor.pick(0, 0, null, null),
      dataTensor.pick(null, null, 0)
    );
    ops.assign(
      dataProcessedTensor.pick(0, 1, null, null),
      dataTensor.pick(null, null, 1)
    );
    ops.assign(
      dataProcessedTensor.pick(0, 2, null, null),
      dataTensor.pick(null, null, 2)
    );

    ops.divseq(dataProcessedTensor, 255);

    const tensor = new Tensor(
      'float32',
      new Float32Array(width * height * 3),
      [1, 3, width, height]
    );
    
   

    (tensor.data).set(dataProcessedTensor.data);
    console.log(tensor);
    return tensor;
  };

  const conf2color = (conf) => {
    const r = Math.round(255 * (1 - conf));
    const g = Math.round(255 * conf);
    return `rgb(${r},${g},0)`;
  };

  const postprocess = async (tensor, inferenceTime, ctx) => {
    const dx = ctx.canvas.width / modelResolution[0];
    const dy = ctx.canvas.height / modelResolution[1];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    console.log(tensor.dims)
    for (let i = 0; i < tensor.dims[0]; i++) {
      let [batch_id, x0, y0, x1, y1, cls_id, score] = tensor.data.slice(
        i * 7,
        i * 7 + 7
      );

      console.log(cls_id, score)

    //   20.446443557739258 20.943105697631836 31.638086318969727 39.88143539428711 40.30268096923828 39.520286560058594 40.09832763671875

     
      
    

      [x0, x1] = [x0, x1].map((x) => x * dx);
      [y0, y1] = [y0, y1].map((x) => x * dy);

      [batch_id, x0, y0, x1, y1, cls_id] = [
        batch_id,
        x0,
        y0,
        x1,
        y1,
        cls_id,
      ].map((x) => round(x));

      console.log(cls_id)

    //   [score] = [score].map((x) => round(x * 100, 1));
      const label =
        yoloClasses[cls_id].toString()[0].toUpperCase() +
        yoloClasses[cls_id].toString().substring(1) +
        ' ' +
        score.toString() +
        '%';
        
        console.log(score, 'ini score')
      const color = conf2color(score / 100);


      console.log(label)

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      ctx.font = '20px Arial';
      ctx.fillStyle = color;
      ctx.fillText(label, x0, y0 - 5);

      ctx.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  };

  return (
    <>
    <WebcamComponent
  
  preprocess={preprocess}
  postprocess={postprocess}
  resizeCanvasCtx={resizeCanvasCtx}
  session={session}
  changeModelResolution={changeModelResolution}
  modelName={modelName}
/>
    </>
  );
};

export default Kamera;
