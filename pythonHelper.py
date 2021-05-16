from PIL import Image, ImageDraw, ExifTags, ImageColor
import sys
import json
def getPath(filePath):
    import os
    script_dir = os.path.dirname(__file__)
    abs_file_path = os.path.join(script_dir, filePath)
    return abs_file_path

def doWork(json):
    BoundingBox = json["BoundingBox"]
    imagePath = json["imagePath"]
    outputPath = json["outputPath"]
    image = Image.open(getPath(imagePath))
    imgWidth, imgHeight = image.size
    draw = ImageDraw.Draw(image)

    box = BoundingBox
    left = imgWidth * box["Left"]
    top = imgHeight * box["Top"]
    width = imgWidth * box["Width"]
    height = imgHeight * box["Height"]
    print("Left: " + "{0:.0f}".format(left))
    print("Top: " + "{0:.0f}".format(top))
    print("Face Width: " + "{0:.0f}".format(width))
    print("Face Height: " + "{0:.0f}".format(height))

    points = (
               (left,top),
               (left + width, top),
               (left + width, top + height),
               (left , top + height),
               (left, top)

    )
    draw.line(points, fill="#00d400", width=2)

    # Alternatively can draw rectangle. However you can"t set line width.
    #draw.rectangle([left,top, left + width, top + height], outline="#00d400")
    image.save(open(outputPath,"w"))

import base64
json = json.loads(base64.b64decode(sys.argv[1]))
doWork(json)



