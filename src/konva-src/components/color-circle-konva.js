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




export const ColorCircleKonva = (props) => {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    const [radius, setRadius] =  useState(Math.round(windowWidth/3));
    const [satLumRadius, setSatLumRadius] = useState(Math.round(radius/3))
    const [centerXY, setCenterXY] = useState([Math.round(windowWidth * (5/24)), Math.round(windowHeight/2)])
    // const [centerXY] = useState([Math.round(windowWidth/3), Math.round(windowWidth/3)])
    const [angle, setAngle] = useState(0)
    const [dist, setDist] = useState(Math.round(radius/2))
    const [numHarmonies, setNumHarmonies] = useState(2)
    const [toggleComplement, setToggleComplement] = useState(false)
    
    const [handleCenter, setHandleCenter] = useState(getCirclePoint(0, dist, centerXY))
    const [toggleHarmonies, setToggleHarmonies] = useState(false)
    const [toggleShades, setToggleShades] = useState(false)
    const [focusHue, setFocusHue] = useState(angle)

    //reducer variables
    
    const initStateShades = getDefaultShades(satLumRadius, centerXY)
    const [shades, shadeDispatch] = useReducer(shadeReducer, initStateShades) 
    
    //state variables requiring initalizatin  of the reducers because we added a whole new thing to handle it :)
    const [saturation, setSaturation] = useState(shades[2].s)
    const [lightness, setLightness] = useState(shades[2].l)
    
    const [wheelColor, setWheelColor] = useState(getOneShadeColor(angle, shades[2].s, shades[2].l))
    const [complement, setComplement] = useState(getComplement(numHarmonies, angle, dist, saturation, centerXY))
    
    const initStateHarms = getHarmonies(numHarmonies, angle, dist, saturation, centerXY )
    const [harmonies, dispatch] = useReducer(harmoniesReducer, initStateHarms)
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
    
    const updateAllShades = (ix) => {
        const shade = shadesRef.current[ix]
        if (shade) {
            shadeDispatch({
                type: SHD_ACTIONS.UPDATE_ALL_SHADES,
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
            setWheelColor(getOneShadeColor(angle, shades[2].s, shades[2].l))
            setComplement(getComplement(numHarmonies, angle, dist, saturation, centerXY))   

            setFocusHue(angle)            
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
        setFocusHue(angle)
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
                            setFocusHue(harmony.angle)
                        }
                    }
                    width={radius/10} 
                    height={radius/10} 
                    fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)} /> )
    }

    const createShadeHandle = (shade, index) => {
        const assignRef = (el) => {shadesRef.current[index]= el}
        const hue = focusHue
            return( 
                
                <>
                < Circle 
                    ref={assignRef}
                    key={shade.key} 
                    x= {shade.x} 
                    y= {shade.y}
                    stroke={'gray'}
                    strokeWidth={5}
                    dragBoundFunc={bindShadeHandlerDrag}
                    draggable
                    onDragMove={ () => {
                        if (!toggleShades) {
                            updateAllShades(shade.key)
                        } else {
                            updateShade(shade.key)
                        }
                    }}
                    width={radius/15} 
                    height={radius/15} 
                    fill={getOneShadeColor(hue, shade.s, shade.l)} />
                    
                    </> )
    }

    const renderShadeHandles = () => {
        let shadesArr = Object.values(shades)
        
        return shadesArr.map ((shade, ix) => createShadeHandle(shade, ix))
    }
   
    const renderHarmonies = () => {
        
        let harms = Object.values(harmonies)
        let renderedHarms = []
        harms.map((harmony) => harmony.key < numHarmonies ? renderedHarms.push(harmony) : "")
        return renderedHarms.map( (harmony,ix) => createHarmCircle(harmony, ix))
    }

    const renderHarmonieSquares = () => {
        let harms = Object.values(harmonies)
        let renderedHarms = []
        harms.map((harmony, ix) => harmony.key < numHarmonies ? renderedHarms.push(harmony) : "")
        // return renderedHarms.map( (harmony,ix) => createHarmonySquare(harmony, 600+(200*ix), 300+(200*ix) ))
    }

    const renderComplement = () => {
        return(<Circle 
        key={complement.key} 
        x={complement.x} 
        y = {complement.y} 
        width={radius/15} 
        height={radius/15} 
        stroke={'gray'}
        strokeWidth={5}
        fill={getOneShadeColor(complement.angle, shades[2].s, shades[2].l)} />)
    }




    useEffect( () => {
        !toggleHarmonies && updateAllHarmonies()
        if (toggleHarmonies) {
            for (let i = 0; i < numHarmonies; i++) {
                if (Object.values(harmonies).length < numHarmonies && !harmonies[i])
                { addHarm(i) }            
            }
        }
        setSaturation((shades[2].s / 100))
        setWheelColor(getOneShadeColor(angle, shades[2].s, shades[2].l))
            

    }, [toggleHarmonies, toggleComplement, numHarmonies, angle, shades, toggleShades, focusHue])


    const createPrimaryShades = (x,y, height, width) => {
      
        return (
            <>
            <Rect 
                x={x + width/20}
                y={y + (height * (6/10))}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 5}
                width = {width / 5}
                fill = {getOneShadeColor(angle, shades[0].s, shades[0].l)}
            />
            <Rect 
                x={x + width/20}
                y={y + height * (3/10)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(angle, shades[1].s, shades[1].l)}
            />
            <Rect 
                x={x + (width * 3/10)}
                y={y + (height/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(angle, shades[3].s, shades[3].l)}
            />

<Rect 
                x={x + (width * 6/10)}
                y={y + (height/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(angle, shades[4].s, shades[4].l)}
            />      
            
            
            </>)

    }
    const createPrimarySquare = ()=> {
        if (numHarmonies === 0){
            const x= windowWidth / 2
            const y= centerXY[1] - (radius/2)
            const height= radius 
            const width= radius 
            return (
                <>
                 <Rect
                    x = {x}
                    y = {y}
                    height = {height}
                    width = {width}
                    fill={wheelColor} />
                {createPrimaryShades(x, y, height, width)}
                </>
            )
        } else {
            const x = windowWidth / 2
            const y = centerXY[1] - (radius/2)
            const height = radius * 2/3 
            const width =radius * 2/3
            return (
                <>
                <Rect
                    x = {x}
                    y = {y}
                    height = {height}
                    width = {width}
                    
                    fill={wheelColor} />
                    {createPrimaryShades(x, y, height, width)}
                    </>
            )
        }
    }

    const create2NDShades = (x,y,height, width) => {
        const hue = harmonies[0].angle
        return (
            <>
            <Rect 
                x={x + (width * 5/8)}
                y={y + (height * 7/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
            <Rect 
                x={x + (width * 5/8)}
                y={y + (height * 5/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
             <Rect 
                x={x + (width * 5/8)}
                y={y + (height * 3/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />

            <Rect 
                x={x + (width * 5/8)}
                y={y + (height * 1/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[4].s, shades[4].l)}
            />

            </>
        )
    }

    const create2NDHarmSquare = () => {
        const x= windowWidth / 2 + (radius * (2/3))
        const y= centerXY[1] - (radius / 2    )
        const height= radius * (2/3)
        const width=radius / 3 
        
        if (harmonies[0]) {
            let harmony = harmonies[0] 
            return (
                <>
                    <Rect
                        key={harmony.key}
                        x = {x}
                        y = {y}
                        height = {height}
                        width = {width}
                        fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)}
                    /> 
                          {create2NDShades(x,y,height,width)}
                    </>)
      
            }
    }

    const create3RDshades = (x,y,height, width) => {
        const hue = harmonies[1].angle
        return (
            <>
            <Rect 
                y={y + (height * 5/8)}
                x={x + (width * 7/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
              <Rect 
                y={y + (height * 5/8)}
                x={x + (width * 5/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
             <Rect 
                y={y + (height * 5/8)}
                x={x + (width * 3/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />
            <Rect 
                y={y + (height * 5/8)}
                x={x + (width * 1/10)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[4].s, shades[4].l)}
            />
        

            </>
        )
    }

    const create3RDHarmSquare = () => {
        const x= windowWidth / 2 
        const y= centerXY[1] - (radius / 2 ) + (radius *(2/3)) 
        const height= radius/ 3
        const width= radius * (2/3)

        if (harmonies[1]) {
            let harmony = harmonies[1]
            return (<>
                    <Rect
                        key={harmony.key}
                        x = {x}
                        y = {y}
                        height = {height}
                        width = {width}
                        fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)}
                    />
                    {create3RDshades(x,y, height, width)}
                    </> )
            }
    }

    const create4THHarmSquare = () => {
        const x = windowWidth / 2 + (radius * (2/3))
        const y = centerXY[1] - (radius / 2 ) + (radius *(2/3))
        const height = radius / 3
        if (harmonies[2]) {
            let harmony = harmonies[2]
            return (<Rect
                        key={harmony.key}
                        x={x}
                        y={y}
                        height={height}
                        width={height}
                        fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)}
                    /> )
        } else if (toggleComplement) {
            return (
                <Rect
                        key={'complement'}
                        x={x}
                        y={y}
                        height={height}
                        width={height}
                        fill={getOneShadeColor(complement.angle, shades[2].s, shades[2].l)}
                    />
            )
        } else {
            return (
                <Rect
                x={x}
                y={y}
                height={height}
                width={height}
                        fill={wheelColor}
                    />
            )
        }

    }




    return (
        <>
        <Stage 
            ref={stage} 
            width={window.innerWidth} 
            height={window.innerHeight} >
                <Layer listening={false}>
                
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
                    }}>
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
                    <Button 
                        variant="contained" 
                        onClick={() => {setToggleShades(!toggleShades)} }>
                            {toggleShades ? "Adjust All Shades" : "Adjust Shades Individually"} 
                    </Button>
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
                    hue={focusHue}
                />
                

                {createPrimarySquare()}
                {create2NDHarmSquare()}
                {create3RDHarmSquare()}
                {create4THHarmSquare()}
                </Layer> 
                <Layer>
             
                <Circle key={'handlerCircle'} 
                    ref={handlerCircle} 
                    x={handleCenter[0]} 
                    y={handleCenter[1]} 
                    width={radius/10} 
                    height={radius/10}
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
        
                

                {(toggleComplement && complement) && renderComplement()}
                </Layer>

               
        </Stage>
        </>
    )
    

}