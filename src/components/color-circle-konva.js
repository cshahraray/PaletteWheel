import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Circle } from "react-konva";
// import {  } from '../utils/circle-utils';
// import { getCirclePoint } from '../utils/circle-utils';
import { getDeltas, angle2Color, getAngle, angleSat2Color, getDist, dist2Sat, getHarmonies } from '../utils/konva-circle-utils';


export const ColorCircleKonva = (props) => {
    //state variables
    const [mouseXY, setMouseXY] = useState(0)
    const centerXY = [200, 200]
    const [deltaXY, setDeltaXY] = useState([])
    const radius = 100
    const [angle, setAngle] = useState(0)
    const [saturation, setSaturation] = useState(0)

    const [wheelColor, setWheelColor] = useState(angle2Color(angle))
    const [harmonies, setHarmonies] = useState([0,0,0])
    const [handleCenter, setHandleCenter] = useState([300, 200])
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    const harmoniesRef = useRef(null)
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

    const drag = () => {

        if (handlerCircle.current) {
            setHandleCenter([handlerCircle.current.attrs.x, handlerCircle.current.attrs.y])
            // console.log(circleXY)
            setDeltaXY(getDeltas(handleCenter, centerXY))
            // console.log(deltas)
            // console.log(deltas)
            
            setAngle(getAngle(deltaXY))
            setSaturation(dist2Sat(deltaXY, radius))
            setWheelColor(angleSat2Color(angle, saturation, radius))

            setHarmonies(getHarmonies(3, angle))
        }

    }

  

    return (
    
        <Stage ref={stage} width={windowWidth} height={windowHeight} >
            <Layer> 
                {//color picker circle
}
                <Circle x={200} y={200} width={200} height={200} fill={wheelColor}  />
            </Layer>
            <Layer>
                <Circle ref={handlerCircle} x={300} y={200} width={30} height={30} fill='blue' draggable dragBoundFunc={bindHandlerDrag} onDragMove={drag}/>
                {harmonies && harmonies.map( (harmony, ix) => 
                    <Circle key={ix} x={400 + (100 * ix )} y = {500} width={100} height={100} fill={angleSat2Color(harmony, saturation)} />)}
            </Layer>
        </Stage>
        
    )
}