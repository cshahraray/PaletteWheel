import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Circle, Text } from "react-konva";
// import {  } from '../utils/circle-utils';
// import { getCirclePoint } from '../utils/circle-utils';
import { getCirclePoint, getDeltas, angle2Color, getAngle, angleSat2Color, getDist, dist2Sat, getHarmonies } from '../utils/konva-circle-utils';


export const ColorCircleKonva = (props) => {
    //state variables
    const centerXY = [200, 200]
    const radius = 100
    const [angle, setAngle] = useState(0)
    const [dist, setDist] = useState(radius)
    const [saturation, setSaturation] = useState(0)

    const [wheelColor, setWheelColor] = useState(angle2Color(angle))
    const [harmonies, setHarmonies] = useState([])
    const [handleCenter, setHandleCenter] = useState(getCirclePoint(270, dist, centerXY))
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
           
            // console.log(deltas)
            // console.log(deltas)
            
            // console.log(angle)
            

        }

    }

    useEffect( () => {
        const deltas = getDeltas(handleCenter, centerXY)
        const handleAngle = getAngle(deltas)
        const distance = getDist(deltas)
        const sat = dist2Sat(deltas, distance)
        const harmonies = getHarmonies (2, handleAngle)

        // setDeltaXY(deltas)
        setAngle(handleAngle)
        setDist(distance)
        setSaturation(sat)
        setHarmonies(harmonies)
        
        setWheelColor(angleSat2Color(handleAngle, sat))
    }, [handleCenter])

  
  

    return (
    
        <Stage ref={stage} width={windowWidth} height={windowHeight} >
            <Layer key={'wheel'}> 
                {//color picker circle
}
                <Circle x={centerXY[0]} y={centerXY[1]} width={200} height={200} fill={'gray'}  />
            </Layer>
            <Layer key={'handle'}>
                <Circle key={'handlerCircle'} ref={handlerCircle} x={handleCenter[0]} y={handleCenter[1]} width={30} height={30} fill={wheelColor} draggable dragBoundFunc={bindHandlerDrag} onDragMove={drag}/>
                <Text key={'yalla'} x={handleCenter[0]} y={handleCenter[1]} text={`Angle: ${angle} Location: ${handleCenter} From Formula: ${getCirclePoint(angle, dist, centerXY)}`}/>
                {harmonies && harmonies.map( (harmony, ix) => 
                    <>
                    <Circle key={ix} x={getCirclePoint(harmony, dist, centerXY)[0]} y = {getCirclePoint(harmony, dist, centerXY)[1]} width={30} height={30} fill={angleSat2Color(harmony, saturation)} />
                    <Text key={`A${ix}`} x={500} y={400 + (100 * ix)} text={`Harmony angle: ${harmony}; Distance: ${dist}; Point: ${getCirclePoint(harmony, dist, centerXY)}`} />    
                    </>
                )}

                    
            </Layer>
        </Stage>
        
    )
}