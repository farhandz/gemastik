import React, { useState, useEffect } from 'react';
import ndarray from 'ndarray';
import { Tensor } from 'onnxruntime-web';
import ops from 'ndarray-ops';
// import ObjectDetectionCamera from '../ObjectDetectionCamera';
import { round } from 'lodash';
import { IconLoader } from '@tabler/icons-react';
import { createModelCpu } from './utilities';
import { yoloClasses } from './utilities';
// import { runModelUtils } from '../../utils';
import onnx from "./bisindov2.onnx";
import WebcamComponent from '../component/Webcamp';

const RES_TO_MODEL = [
  [[800, 800], onnx],
];

const Kamera = () => {
  const [modelResolution, setModelResolution] = useState(RES_TO_MODEL[0][0]);
  const [modelName, setModelName] = useState(RES_TO_MODEL[0][1]);
  const [session, setSession] = useState(null);
  const [texts, setText] = useState([])
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const session = await createModelCpu(
        onnx
      ).then((data) => {
        return data;
      }).finally(() => {
        setLoading(false)
      });
      // console.log(session)
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

    // console.log(dataProcessedTensor)

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

    
    const output = tensor.data;
    // console.log(tensor.data)
    let boxes = [];
    for (let index=0;index<13125;index++) {
        const [class_id,prob] = [...Array(36).keys()]
            .map(col => [col, output[13125*(col+4)+index]])
            .reduce((accum, item) => item[1]>accum[1] ? item : accum,[0,0]);
        if (prob < 0.2) {
            continue;
        }
        const label = yoloClasses[class_id];
        const xc = output[index];
        const yc = output[13125+index];
        const w = output[2*13125+index];
        const h = output[3*13125+index];
        const x1 = (xc-w/2)/800 * ctx.canvas.width;
        const y1 = (yc-h/2)/800 * ctx.canvas.width;
        const x2 = (xc+w/2)/800 * ctx.canvas.width;
        const y2 = (yc+h/2)/800 * ctx.canvas.width;

        boxes.push([x1,y1,x2,y2,label,prob]);
    }

    boxes = boxes.sort((box1,box2) => box2[5]-box1[5])
    const result = [];
    while (boxes.length>0) {
        result.push(boxes[0]);
        boxes = boxes.filter(box => iou(boxes[0],box)<0.7);
    }
    console.log(result)
    draw_boxes(ctx, result)
    // for (let i = 0; i < tensor.dims[2]; i++) {
    //   let [batch_id, x0, y0, x1, y1, cls_id, score] = tensor.data.slice(
    //     i * 4,
    //     i * 4 + 4
    //   );

    //   console.log(cls_id, score)

    // //   20.446443557739258 20.943105697631836 31.638086318969727 39.88143539428711 40.30268096923828 39.520286560058594 40.09832763671875

     
      
    

    //   [x0, x1] = [x0, x1].map((x) => x * dx);
    //   [y0, y1] = [y0, y1].map((x) => x * dy);

    //   [batch_id, x0, y0, x1, y1, cls_id] = [
    //     batch_id,
    //     x0,
    //     y0,
    //     x1,
    //     y1,
    //     cls_id,
    //   ].map((x) => round(x));

    //   console.log(cls_id)

    // //   [score] = [score].map((x) => round(x * 100, 1));
    //   const label =
    //     yoloClasses[cls_id].toString()[0].toUpperCase() +
    //     yoloClasses[cls_id].toString().substring(1) +
    //     ' ' +
    //     score.toString() +
    //     '%';
        
    //     console.log(score, 'ini score')
    //   const color = conf2color(score / 100);


    //   console.log(label)

    //   ctx.strokeStyle = color;
    //   ctx.lineWidth = 3;
    //   ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    //   ctx.font = '20px Arial';
    //   ctx.fillStyle = color;
    //   ctx.fillText(label, x0, y0 - 5);

    //   ctx.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
    //   ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    // }
  };

function iou(box1,box2) {
    return intersection(box1,box2)/union(box1,box2);
}

function union(box1,box2) {
    const [box1_x1,box1_y1,box1_x2,box1_y2] = box1;
    const [box2_x1,box2_y1,box2_x2,box2_y2] = box2;
    const box1_area = (box1_x2-box1_x1)*(box1_y2-box1_y1)
    const box2_area = (box2_x2-box2_x1)*(box2_y2-box2_y1)
    return box1_area + box2_area - intersection(box1,box2)
}

function intersection(box1,box2) {
    const [box1_x1,box1_y1,box1_x2,box1_y2] = box1;
    const [box2_x1,box2_y1,box2_x2,box2_y2] = box2;
    const x1 = Math.max(box1_x1,box2_x1);
    const y1 = Math.max(box1_y1,box2_y1);
    const x2 = Math.min(box1_x2,box2_x2);
    const y2 = Math.min(box1_y2,box2_y2);
    return (x2-x1)*(y2-y1)
}

function draw_boxes(ctx,boxes) {
  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 3;
  ctx.font = "18px serif";
  const datText = [];
  boxes.forEach(([x1,y1,x2,y2,label]) => {
      datText.push(label)
     
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);
      ctx.fillStyle = "#00ff00";
      const width = ctx.measureText(label).width;
      ctx.fillRect(x1,y1,width+10,25);
      ctx.fillStyle = "#000000";
      ctx.fillText(label, x1, y1+18);
  });
  setText(prevTexts => [...prevTexts, ...datText]);
}



if (loading) {
  return <div className='bg-violet-500 w-screen 
  h-screen flex justify-center items-center
   text-white'>Loading...  <IconLoader /> </div>;
}
  return (
    <>
    
    <WebcamComponent
  texts={texts.join(',')}
  preprocess={preprocess}
  postprocess={postprocess}
  resizeCanvasCtx={resizeCanvasCtx}
  session={session}
  resetText={()=> {
    setText([])
  }}
  changeModelResolution={changeModelResolution}
  modelName={modelName}
/>
    </>
  );
};

export default Kamera;
