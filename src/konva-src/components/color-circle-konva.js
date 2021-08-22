import React, { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Stage, Layer, Circle, Text, Rect, FastLayer } from "react-konva";
import {Html} from "react-konva-utils"
// import {  } from '../utils/circle-utils';
// import { getCirclePoint } from '../utils/circle-utils';
import { getCirclePoint, getDeltas, angle2Color, getAngle, angleSat2Color, getDist, dist2Sat, getHarmonies, getComplement, getHarmonyObj, dummyHarmonyObj } from '../../utils/konva-circle-utils';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';
import { RainbowFill } from '../../graphics/rainbowfill';
import { ACTIONS, harmoniesReducer, SHD_ACTIONS, shadeReducer } from '../reducers/color-wheel-reducer';
import { HarmonySquares } from './harmony-squares';
import { SatLumCircle } from '../../graphics/sat-lum-circle-graphic';
import { getAngleFromLightness, getDefaultShades, getDistFromSat, getOneShadeColor } from '../utils/shade-utils';
//action consatants


const windowHeight = window.innerHeight
const windowWidth = window.innerWidth


export const ColorCircleKonva = (props) => {
    

    const sizes = {
        window: [props.window],
        wheel: Math.round(windowWidth/3),
    
    }
    
    const positions = {
        wheel: [Math.round(props.window[0]* (5/12)), Math.round(props.window[1] * (5/12))]
    }

    const [radius, setRadius] =  useState(300);
    const [satLumRadius, setSatLumRadius] = useState(radius/3)
    const [centerXY, setCenterXY] = useState([400, 400])
    // const [centerXY] = useState([Math.round(windowWidth/3), Math.round(windowWidth/3)])
    const [angle, setAngle] = useState(0)
    const [dist, setDist] = useState(radius/2)
    const [saturation, setSaturation] = useState(dist2Sat(dist, radius))
    const [numHarmonies, setNumHarmonies] = useState(2)
    const [toggleComplement, setToggleComplement] = useState(false)
    const [wheelColor, setWheelColor] = useState(angleSat2Color(angle, saturation))
    const [complement, setComplement] = useState(getComplement(numHarmonies, angle, dist, saturation, centerXY))
    const [handleCenter, setHandleCenter] = useState(getCirclePoint(0, dist, centerXY))
    const [toggleHarmonies, setToggleHarmonies] = useState(false)
    //reducer variables
    const initStateHarms = getHarmonies(numHarmonies, angle, dist, saturation, centerXY )
    const [harmonies, dispatch] = useReducer(harmoniesReducer, initStateHarms)
    const initStateShades = getDefaultShades()
    const [shades, shadeDispatch] = useReducer(shadeReducer, initStateShades) 
    
    
    
    //refs
    const harmoniesRef = useRef({});
    const shadesRef = useRef({})
    const handlerCircle = useRef(null)
    const stage = useRef(null)
 
    //helper methods for keeping handler drag within circle
    const bindHandlerDrag = (pos) => {
        const x = centerXY[0]
        const y = centerXY[1]
        const deltas = getDeltas([pos.x, pos.y], [x,y])
        const distance = getDist(deltas)
        const scale = (radius/2) / distance
        const scale2 =  ((radius * 2/3)/2) / distance
        console.log('scale2')
        console.log(scale2)
        
        //is the radius / new dist < 1 --> outside circle
        //is the 2ndradius / dist < 1 --> outside second circle
        
        if (scale < 1) {
                return {
                    y: Math.round((pos.y - y) * scale + y),
                    x: Math.round((pos.x - x) * scale + x),
                };
            
        } else {
            if (scale2 < 1) {
                return pos;
            } else {
                return {
                    y: Math.round((pos.y - y) * scale2 + y),
                    x: Math.round((pos.x - x) * scale2 + x),
                }
            }
        }
      }

    const bindShadeHandlerDrag = (pos) => {
        const x = centerXY[0]
        const y = centerXY[1]
        const deltas = getDeltas([pos.x, pos.y], [x,y])
        const distance = getDist(deltas)
        const scale = (satLumRadius) / distance

        if (scale < 1) {
            return {
                y: Math.round((pos.y - y) * scale + y),
                x: Math.round((pos.x - x) * scale + x),
            };
        
        } else {
            return pos
        }

    }

    //reducer actions and promises
    const fetchHarmonies = async () => {
        await dispatch({
            type: ACTIONS.GET_HARMONIES}
        )
    }

    const updateAllHarmonies = () => {
            dispatch({
               type: ACTIONS.UPDATE_ALL_HARMONIES,
               numHarmonies, 
               angle,
               dist,
               saturation, 
               centerXY
           })
    }

    const updateHarm = (ix) => {
        // console.log(harmoniesRef)
        const harm = harmoniesRef.current[ix]
        if (harm){
            dispatch({
                            type: ACTIONS.UPDATE_HARMONY,
                            x: harm.attrs.x,
                            y: harm.attrs.y,
                            ix: ix,
                            centerXY: centerXY,
                            radius: radius
            })
        }
    }    

    const updateShade = (ix) => {
        // console.log(harmoniesRef)
        const shade = shadesRef.current[ix]
        if (shade){
            shadeDispatch({
                            type: SHD_ACTIONS.UPDATE_SHADE,
                            x: shade.attrs.x,
                            y: shade.attrs.y,
                            ix: ix,
                            centerXY: centerXY,
                            radius: satLumRadius
            })
        }
    }   


    const addHarm = (i) => {
        dispatch(
            {type: ACTIONS.ADD_HARMONY, 
            key: i,    
            centerXY
                })
    }

    //event methods
    const handlerDrag = () => {

        if (handlerCircle.current) {
            setHandleCenter([handlerCircle.current.attrs.x, handlerCircle.current.attrs.y])
            const deltas = getDeltas(handleCenter, centerXY)
            setAngle(getAngle(deltas))
            setDist(getDist(deltas))
            setSaturation(dist2Sat(dist, radius))
            setWheelColor(angleSat2Color(angle, saturation))
            setComplement(getComplement(numHarmonies, angle, dist, saturation, centerXY))   
          

            if (!toggleHarmonies) {updateAllHarmonies()}
            
        }
    }

    

        //event methods for inputs
    const handleHarmoniesInput = (e) => {
        setNumHarmonies(e.target.value)
        if (toggleHarmonies && Object.values(harmonies).length < numHarmonies) {
            addHarm(Object.values(harmonies).length - 1)
        }
    }

    const handleToggleHarmoniesInput = (e) => {
        setToggleHarmonies(e.target.value)
    }

    const handleToggleComplementInput = (e) => {
        setToggleComplement(numHarmonies === 3 ? true : !toggleComplement)
    }

    //helper methods / component-'constructors'

    const createHarmCircle = (harmony, index) => {
        const assignRef = (el) => {harmoniesRef.current[index]= el}
            return(  
        
                < Circle 
                    ref={assignRef}
                    key={harmony.key} 
                    x= {harmony.x} 
                    y= {harmony.y}
                    stroke={'gray'}
                    strokeWidth={5}
                    draggable={toggleHarmonies}
                    dragBoundFunc={bindHandlerDrag}
                    onDragMove={
                        () => { 
                            updateHarm(harmony.key)
                        }
                    }
                    width={30} 
                    height={30} 
                    fill={harmony.fill} /> )
    }

    const createShadeHandle = (shade, index) => {
        const assignRef = (el) => {shadesRef.current[index]= el}
        let ang = getAngleFromLightness(shade.l, satLumRadius)
        let distance = getDistFromSat(shade.s, satLumRadius)
        let posXY = getCirclePoint(ang, distance, centerXY)
            
            return( 
                
        
                < Circle 
                    ref={assignRef}
                    key={shade.key} 
                    x= {posXY[0]} 
                    y= {posXY[1]}
                    stroke={'gray'}
                    strokeWidth={5}
                    dragBoundFunc={bindShadeHandlerDrag}
                    draggable
                    onDragMove={ () => {
                        updateShade(shade.key)

                    }}
                    width={30} 
                    height={30} 
                    fill={getOneShadeColor(angle, shade.s, shade.l)} /> )
    }

    const renderShadeHandles = () => {
        let shadesArr = Object.values(shades)
        
        return shadesArr.map ((shade, ix) => createShadeHandle(shade, ix))
    }
   
    const renderHarmonies = () => {
        
        let harms = Object.values(harmonies)
        let renderedHarms = []
        harms.map((harmony, ix) => harmony.key < numHarmonies ? renderedHarms.push(harmony) : "")
        return renderedHarms.map( (harmony,ix) => createHarmCircle(harmony, ix))
    }

    const renderHarmonieSquares = () => {
        let harms = Object.values(harmonies)
        let renderedHarms = []
        harms.map((harmony, ix) => harmony.key < numHarmonies ? renderedHarms.push(harmony) : "")
        return renderedHarms.map( (harmony,ix) => createHarmonySquare(harmony, 600+(200*ix), 300+(200*ix) ))
    }




    useEffect( () => {
        !toggleHarmonies && updateAllHarmonies()
        if (toggleHarmonies) {
            for (let i = 0; i < numHarmonies; i++) {
                if (Object.values(harmonies).length < numHarmonies && !harmonies[i])
                { addHarm(i) }            
            }
        }
            

    }, [toggleHarmonies, numHarmonies, angle, shades])

    const createPrimarySquare = ()=> {
        return (<Rect
                x={600}
                y={150}
                height={200}
                width={200}
                fill={wheelColor}
                />)
    }

    const createHarmonySquare = (harmony, xPos, yPos) => {
        return (<Rect
                key={harmony.key}
                x={xPos}
                y={yPos}
                height={200}
                width={200}
                fill={harmony.fill}
                /> 
                )
    }




    return (
        <>
        <Stage 
            ref={stage} 
            width={window.innerWidth} 
            height={window.innerHeight} >
                <FastLayer key={'inputs'}>
                
                <Html transform={true} 
                    divProps={{
                        style: {
                            display: "flex",
                            alignItems: "center",
                        }
                    }}>

                    {/*Select for number of harmonies */}
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel># of Harmonies</InputLabel>
                    <Select
                    value={numHarmonies}
                    onChange={(e) => {
                        setNumHarmonies(e.target.value)
                        // updateAllHarmonies()
                    }}
                    >
                    <MenuItem key={1} value={0}>Monochrome</MenuItem>
                    <MenuItem key={2} value={2}>Triad</MenuItem>
                    <MenuItem key={3} value={3}>Tetrad</MenuItem>
                    </Select>
                    </FormControl>

                    {/*Select for toggle harmonies */}
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel>Harmonies</InputLabel>
                    <Select
                    value={toggleHarmonies}
                    onChange={handleToggleHarmoniesInput}
                    >
                    <MenuItem key={1} value={true}>Custom</MenuItem>
                    <MenuItem key={2} value={false}>Fixed</MenuItem>
                    </Select>
                    </FormControl>
                    {numHarmonies < 3  && 
                    <Button 
                        variant="contained" 
                        onClick={handleToggleComplementInput}>
                            {toggleComplement ? "Remove Complement" : "Add Complement"} 
                    </Button>
                    }

                </Html>
                   


                   {/* color picker circle */}
                <RainbowFill 
                    xPos={centerXY[0]} 
                    yPos={centerXY[1]}
                    rad={radius/2}
                 
                />
                   <SatLumCircle 
                    xPos={centerXY[0]} 
                    yPos={centerXY[1]}
                    rad={satLumRadius}
                    hue={angle}
                />
                

                {createPrimarySquare()}
                <HarmonySquares numHarmonies={numHarmonies} harmonies={harmonies}/>
                </FastLayer> 
                <Layer>
             
                <Circle key={'handlerCircle'} 
                    ref={handlerCircle} 
                    x={handleCenter[0]} 
                    y={handleCenter[1]} 
                    width={30} 
                    height={30}
                    stroke={'gray'}
                    strokeWidth={5}
                    fill={wheelColor} 
                    draggable 
                    dragBoundFunc={bindHandlerDrag} 
                    onDragMove={handlerDrag}
                />
                <Text 
                    key={'yalla'} 
                    x={handleCenter[0]}
                    y={handleCenter[1]} 
                    text={`Angle: ${angle} Location: ${handleCenter} From Formula: ${getCirclePoint(angle, dist, centerXY)} Sat: ${saturation}`}/>              
                                        

                
                {harmonies && renderHarmonies()}
                {shades && renderShadeHandles()}
        
                

                {(toggleComplement && complement) &&
                <Circle 
                key={complement.key} 
                x={complement.x} 
                y = {complement.y} 
                width={30} 
                height={30} 
                stroke={'gray'}
                    strokeWidth={5}
                fill={complement.fill} />

                }
                </Layer>

               
        </Stage>
        </>
    )
    

}