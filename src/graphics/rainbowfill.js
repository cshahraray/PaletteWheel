import React, { useEffect, useRef, useState } from 'react';
import { Circle, Image } from 'react-konva';
import { hsv2rgb } from '../utils/colorspace-utils';
import { deg2Rad, getDeltas, getDist, rad2Deg, xy2polar } from '../utils/konva-circle-utils';

//this component maps the visible color spectrum to 
//a circle :)

//it is based on some canvas code I found here: [reminder to put the link]
//i reactified it a bit :)
export const RainbowFill = (props) => {
    const [imageCanvas, setImageCanvas] = useState(null);
    const {rad, xPos, yPos} = props; 
    const width = 2 * rad;
    const height = 2 * rad;


    const drawCircle = (context) => {
        let image = context.createImageData(width, height);
        let data = image.data;
   

        for (let x = -rad; x < rad; x++) {
            for (let y = -rad; y < rad; y++) {
                let [r, phi] = xy2polar(x, y);
                let deg = rad2Deg(phi);      
                    let rowLength = 2*rad;
                    let adjustedX = x + rad; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    let adjustedY = y + rad; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    let pixelWidth = 4; // each pixel requires 4 slots in the data array
                    let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

                if (r < rad) {
                  // skip all (x,y) coordinates that are outside of the circle
                    
                    let hue = deg;
                    let saturation = (getDist(getDeltas([adjustedX, adjustedY],[rad, rad]))) / rad;
                    let value;
                    saturation < .5 ? value = saturation : value = 1-saturation

                    let [red, green, blue] = hsv2rgb(hue, saturation, 1- (value * value));
                    let alpha = 255;
                    
                    data[index] = red;
                    data[index+1] = green;
                    data[index+2] = blue;
                    data[index+3] = alpha;
                } else {
                    data[index] = 0;
                    data[index+1] = 0;
                    data[index+2] = 0;
                    data[index+3] = 0;

                }
                        
            }
            
        }

        context.putImageData(image, 0, 0)


    }

    useEffect(() => {
        const canvas = (document.createElement('canvas'))
        const context = canvas.getContext('2d')
        canvas.height = (2*rad)
        canvas.width = (2*rad)
        drawCircle(context)
      
        

        setImageCanvas(canvas)
    }, [])

    return(

        imageCanvas && (
        <>
        <Image 
            offsetX={rad} 
            offsetY={rad} 
            scaleY={-1}
             width={2*rad} 
             height={2*rad} 
             x={xPos} 
             rotation={90}
              y={yPos}
               image={imageCanvas}/>
        </>
    )
    )
    


}


