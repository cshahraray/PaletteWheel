import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-konva';
import { hsv2rgb } from '../utils/colorspace-utils';
import { deg2Rad, getDist, rad2Deg, xy2polar } from '../utils/konva-circle-utils';


export const RainbowFill = (props) => {
    const [imageCanvas, setImageCanvas] = useState(null);
    const {rad, xPos, yPos} = props; 
    const width = 2 * rad;
    const height = 2 * rad;


    const drawCircle = (context) => {
        let image = context.createImageData(width, height);
        let data = image.data;
        context.save()
        context.rotate(90*Math.PI/180);

        for (let x = -rad; x < rad; x++) {
            for (let y = -rad; y < rad; y++) {
                let [r, phi] = xy2polar(x, y);
                
                if (r < rad) {
                  // skip all (x,y) coordinates that are outside of the circle
                    let deg = rad2Deg(phi);      
                    let rowLength = 2*rad;
                    let adjustedX = x + rad; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    let adjustedY = y + rad; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    let pixelWidth = 4; // each pixel requires 4 slots in the data array
                    let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

                    let hue = deg;
                    let saturation = 1.0;
                    let value = 1.0;

                    let [red, green, blue] = hsv2rgb(hue, saturation, value);
                    let alpha = 255;
                    
                    data[index] = red;
                    data[index+1] = green;
                    data[index+2] = blue;
                    data[index+3] = alpha;
                }
                        
            }
            
        }

        context.putImageData(image, 0, 0)
        context.restore()



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

        imageCanvas && <Image offsetX={rad} offsetY={rad} scaleY={-1} width={2*rad} height={2*rad} x={xPos} rotation={90} y={yPos} image={imageCanvas}/>
    )


}


