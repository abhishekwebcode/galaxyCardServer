const express = require('express');
const logger = require('morgan');
const aws = require('./aws')
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const fs = require('fs');
const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

deepai.setApiKey('f866fef0-e7e3-43da-8811-39ddfabc8a26');

const run = (filePath, callback) => {
    deepai.callStandardApi("facial-recognition", {
        image: fs.createReadStream(filePath),
    }).then(function (result) {
        console.log({result})
        callback(null, result);
    }, function (error) {
        callback(error);
    });
}

app.post('/deepai', (request, response) => {
    const {imageData, fileName} = request.body;
    if (imageData && fileName) {
        const fileExt = fileName.split('.').pop();
        const randomFileName = Date.now() + '.' + fileExt
        const filePath = './images/' + randomFileName;
        fs.writeFileSync(filePath, imageData, {
            encoding: 'base64'
        });

        run(filePath, (err, data) => {
            fs.unlinkSync(filePath);
            if (err) return response.json({success: false});
            response.json({data});
        })
    }
    return response.json({success: false});
})

app.post('/aws', (request, response) => {
    const {imageData, fileName} = request.body;
    if (imageData && fileName) {
        const fileExt = fileName.split('.').pop();
        const randomFileName = Date.now() + '.' + fileExt
        const filePath = './images/' + randomFileName;
        const outPath = './images/' + 'out_' + randomFileName;
        fs.writeFileSync(filePath, imageData, {
            encoding: 'base64'
        });
        aws({
            imageData, callback: (err, data) => {
                console.log({err, data})
                if (err) {
                    return response.json({success: false});
                }
                const outputImage = fs.readFileSync(outPath).toString('base64');
                return response.json({success: true, outputImage,})
            }, imagePath: filePath, outputPath: outPath
        })
    }

})

app.listen(8080)
console.log(`LISTENENIG`);
process.on('uncaughtException', () => {
})
process.on('unhandledRejection', () => {
})
