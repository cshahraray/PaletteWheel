import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Circle, Text } from "react-konva";
import {Html} from "react-konva-utils"
// import {  } from '../utils/circle-utils';
// import { getCirclePoint } from '../utils/circle-utils';
import { getCirclePoint, getDeltas, angle2Color, getAngle, angleSat2Color, getDist, dist2Sat, getHarmonies } from '../utils/konva-circle-utils';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export const ColorCircleKonva = (props) => {
    //state variables
    const [centerXY] = useState([200, 200])
    const radius = 100
    const [angle, setAngle] = useState(0)
    const [dist, setDist] = useState(radius)
    const [saturation, setSaturation] = useState(0)
    const [numHarmonies, setNumHarmonies] = useState(2)

    const [wheelColor, setWheelColor] = useState(angle2Color(angle))
    const [harmonies, setHarmonies] = useState(getHarmonies(numHarmonies, angle, dist, saturation, centerXY))
    const [handleCenter, setHandleCenter] = useState(getCirclePoint(0, dist, centerXY))
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    const harmoniesRef = useRef(null)
    const handlerCircle = useRef(null)
    const stage = useRef(null)
 
    //event methods for handler
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

    //event methods for inputs
    const handleHarmoniesInput = (e) => {
        setNumHarmonies(e.target.value)
    }

    useEffect( () => {
        const deltas = getDeltas(handleCenter, centerXY)
        const handleAngle = getAngle(deltas)
        const distance = getDist(deltas)
        const sat = dist2Sat(deltas, radius)
        const harmonies = getHarmonies(numHarmonies, handleAngle, distance, sat, centerXY)

        // setDeltaXY(deltas)
        setAngle(handleAngle)
        setDist(distance)
        setSaturation(sat)
        setHarmonies(harmonies)
        
        setWheelColor(angleSat2Color(handleAngle, sat))
    }, [handleCenter, numHarmonies])
  

    return (
        <>
        <Stage 
            ref={stage} 
            width={windowWidth} 
            height={windowHeight} >

            <Layer key={'wheel'}> 
                {//color picker circle
}       
                <Circle 
                    x={centerXY[0]} 
                    y={centerXY[1]} 
                    width={200} 
                    height={200} 
                    fill={'gray'}  
                />

            </Layer>

            <Layer key={'handle'}>
                <Circle key={'handlerCircle'} 
                    ref={handlerCircle} 
                    x={handleCenter[0]} 
                    y={handleCenter[1]} 
                    width={30} 
                    height={30}
                    fill={wheelColor} 
                    draggable 
                    dragBoundFunc={bindHandlerDrag} 
                    onDragMove={drag}
                />
                <Text 
                    key={'yalla'} 
                    x={handleCenter[0]}
                    y={handleCenter[1]} 
                    text={`Angle: ${angle} Location: ${handleCenter} From Formula: ${getCirclePoint(angle, dist, centerXY)} Sat: ${saturation}`}/>
                {harmonies && Object.values(harmonies).map( (harmony, ix) => 
                    <>
                    <Circle 
                        key={harmony.key} 
                        x={harmony.x} 
                        y = {harmony.y} 
                        width={30} 
                        height={30} 
                        fill={harmony.fill} />
              
                    </>

                    
                )}


            </Layer>
            <Layer key={'inputs'}>
                <Html>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label"># of Harmonies</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={numHarmonies}
                    onChange={handleHarmoniesInput}
                    >
                    <MenuItem key={1} value={0}>Monochrome</MenuItem>
                    <MenuItem key={2} value={2}>Triad</MenuItem>
                    <MenuItem key={3} value={3}>Tetrad</MenuItem>
                    </Select>
                    </FormControl>
                </Html>

            </Layer>
        </Stage>
        </>
    )
}