const json = {
    BoundingBox : {
        Height: 0.24492445588111877,
        Left: 0.12652388215065002,
        Top: 0.5296787023544312,
        Width: 0.5356237888336182,
    },
    imagePath: "./images/1621164164316.jpg".slice(2),
    outputPath: "./images/out_1621164164316.jpg".slice(2),
};
const trigger = Buffer.from(JSON.stringify(json)).toString("base64");

const output = require('child_process').execSync(`python3 pythonHelper.py ${trigger}`).toString();
console.log(output)