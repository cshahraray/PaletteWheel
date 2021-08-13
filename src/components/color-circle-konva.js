import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Circle } from "react-konva";
import { angle2Color, getAngle, getCirclePoint, getDeltas } from '../utils/circle-utils';
export const ColorCircleKonva = (props) => {
    //state variables
    const [mouseXY, setMouseXY] = useState(0)
    const centerXY = [200, 200]
    const [deltaXY, setDeltaXY] = useState([])
    const radius = 100
    const [angle, setAngle] = useState(0)
    const [wheelColor, setWheelColor] = useState('rgb(255,50,50)')
    const [harmonies, setHarmonies] = useState([0,0,0])
    const [handleCenter, setHandleCenter] = useState([300, 200])
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    const handlerCircle = useRef(null)
    const stage = useRef(null)
    // const handleDrag = () => {
    //     setMouseXY(Stage.getPointerPosition())
    //     setDeltaXY(getDeltas(mouseXY[0], mouseXY[1], centerXY))
    //     setAngle(getAngle(deltaXY))
    //     setHandleCenter(getCirclePoint(angle, radius, centerXY))
    //     setWheelColor(angle2Color(angle))

    // }
    const bindHandlerDrag = (pos) => {
        const x = centerXY[0]
        const y = centerXY[1]
        const circleRadius = radius;
        var scale =
          circleRadius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
        if (scale < 1)
          return {
            y: Math.round((pos.y - y) * scale + y),
            x: Math.round((pos.x - x) * scale + x),
          };
        else return pos;
      }

    return (
    
        <Stage ref={stage} width={windowWidth} height={windowHeight} >
            <Layer> 
                {//color picker circle
}
                <Circle x={200} y={200} width={200} height={200} fill={wheelColor}  />
            </Layer>
            <Layer>
                <Circle ref={handlerCircle} x={300} y={200} width={30} height={30} fill='blue' draggable dragBoundFunc={bindHandlerDrag}/>

            </Layer>
        </Stage>
        
    )
}