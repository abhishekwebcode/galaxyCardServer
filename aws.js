const AWS = require('aws-sdk')
const PImage = require('pureimage');
const config = new AWS.Config({
    accessKeyId: 'AKIAY7I3UMU6LHKDYSM4',
    secretAccessKey: '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',
    region: 'us-east-1'
})
AWS.config.update(config);

const fs = require('fs');
var rekognition = new AWS.Rekognition();
module.exports = async ({imageData,callback,imagePath,outputPath}) => {
    console.clear();
    var params = {
        Image: { /* required */
            Bytes: Buffer.from(imageData,'base64')
                //|| 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
        },
        Attributes: [
            'DEFAULT'
        ]
    };
    rekognition.detectFaces(params, function(err, data) {
        if (err) callback(err,null);
        if (err) return console.log(err, err.stack); // an error occurred
        PImage.decodeJPEGFromStream(fs.createReadStream(imagePath)).then(image=>{
            const img2 = PImage.make(image.width,image.height);
            const c = img2.getContext('2d');
            c.strokeStyle='red';
            c.drawImage(image,
                0, 0, image.width, image.height, // source dimensions
                0, 0, image.width, image.height, // source dimensions
            );
            if (data.FaceDetails.length===1) {
                // only mark 1 face
                console.log(`stroking...`)
                let BoundingBox=data.FaceDetails[0].BoundingBox;
                console.log({BoundingBox,imagePath,outputPath})
                Left = BoundingBox.Left * image.width
                Top = BoundingBox.Top  * image.height
                FaceWidth = BoundingBox.Width  * image.width
                FaceHeight = BoundingBox.Height  * image.height
                c.strokeRect(Left,Top,FaceWidth,FaceHeight)
            }
            PImage.encodeJPEGToStream(img2,fs.createWriteStream(outputPath), 100).then(() => {
                callback(null,outputPath);
            });
        })
    });
}

