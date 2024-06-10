import { InferenceSession, Tensor } from "onnxruntime-web";

const labelMap = {
    0: { name: "A", color: "#8B008B" },
    1: { name: "Apa", color: "#FF69B4" },
    2: { name: "B", color: "#CD5C5C" },
    3: { name: "C", color: "#FFD700" },
    4: { name: "D", color: "#008080" },
    5: { name: "E", color: "#DC143C" },
    6: { name: "F", color: "#8B0000" },
    7: { name: "G", color: "#00FFFF" },
    8: { name: "H", color: "#FF8C00" },
    9: { name: "Halo", color: "#FFA07A" },
    10: { name: "I", color: "#7FFF00" },
    11: { name: "ILoveYou", color: "#FFDAB9" },
    12: { name: "J", color: "#4682B4" },
    13: { name: "K", color: "#556B2F" },
    14: { name: "Kamu", color: "#40E0D0" },
    15: { name: "L", color: "#FF6347" },
    16: { name: "M", color: "#00FF00" },
    17: { name: "Malam", color: "#DA70D6" },
    18: { name: "N", color: "#8A2BE2" },
    19: { name: "Nama", color: "#FF4500" },
    20: { name: "O", color: "#DAA520" },
    21: { name: "P", color: "#4B0082" },
    22: { name: "Pagi", color: "#0000FF" },
    23: { name: "Q", color: "#8B4513" },
    24: { name: "R", color: "#FF0000" },
    25: { name: "S", color: "#7CFC00" },
    26: { name: "Saya", color: "#8FBC8F" },
    27: { name: "Selamat-Terimakasih", color: "#B0E0E6" },
    28: { name: "Siapa", color: "#2E8B57" },
    29: { name: "T", color: "#F08080" },
    30: { name: "U", color: "#9932CC" },
    31: { name: "V", color: "#20B2AA" },
    32: { name: "W", color: "#00FF7F" },
    33: { name: "X", color: "#6495ED" },
    34: { name: "Y", color: "#E9967A" },
    35: { name: "Z", color: "#FF1493" }
  };

  export async function createModelCpu(
    url
  ) {
    return await InferenceSession.create(url, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
  }

  
  export async function runModelUtil(model, preprocessedData) {
    try {
      const feeds = {};
      console.log(preprocessedData)
      feeds[model.inputNames[0]] = preprocessedData;
      const start = Date.now();
      const outputData = await model.run(feeds);
      const end = Date.now();
      const inferenceTime = end - start;
      const output = outputData[model.outputNames[0]];
      return [output, inferenceTime];
    } catch (e) {
      console.error(e);
      throw new Error();
    }
  }
  

  export const yoloClasses = [
    "A",
    "Apa",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "Halo",
    "I",
    "ILoveYou",
    "J",
    "K",
    "Kamu",
    "L",
    "M",
    "Malam",
    "N",
    "Nama",
    "O",
    "P",
    "Pagi",
    "Q",
    "R",
    "S",
    "Saya",
    "Selamat-Terimakasih",
    "Siapa",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
]

  
// Define a drawing function drawRect(canvasRef, detectionBoxes, detectionClasses, detectionScores, );
export function drawRect(canvasRef, boxes, classes, scores,  threshold = 70) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check that input arrays are valid
    if (!boxes || !classes || !scores || boxes.length !== classes.length || classes.length !== scores.length) {
        console.error("Input arrays are invalid or not of the same length");
        return;
    }

    for (let i = 0; i < boxes.length; i++) {
        const [y, x, height, width] = boxes[i];

        // Filter out low-confidence detections
        if (scores[i] > threshold) {
            const classIndex = Math.round(classes[i]);

            // Ensure classIndex exists in labelMap
            if (labelMap[classIndex]) {
                const label = labelMap[classIndex].name;
                const color = labelMap[classIndex].color;

                // Debugging: Log the classIndex and the corresponding value
                console.log(`Processing detection ${i}: Class Index = ${classIndex}, Label = ${label}, Score = ${scores[i]}`);

                // Draw rectangle
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.stroke();

                // Draw label background
                const textWidth = ctx.measureText(label).width;
                const textHeight = parseInt(ctx.font, 10); // base 10
                ctx.fillRect(x, y - textHeight, textWidth + 4, textHeight);

                // Draw label text
                ctx.fillStyle = '#ffffff'; // White color for the text
                ctx.fillText(label, x, y - 4); // Adjust the label position as needed
            } else {
                console.error(`Label not found for class index ${classIndex}`);
            }
        }
    }
}

