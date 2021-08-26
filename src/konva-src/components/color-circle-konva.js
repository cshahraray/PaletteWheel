import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Stage, Layer, Circle, Text, Rect, } from "react-konva";
import {Html} from "react-konva-utils"
// import {  } from '../utils/circle-utils';
// import { getCirclePoint } from '../utils/circle-utils';
import { getCirclePoint, getDeltas, getAngle, getDist, getHarmonies, getComplement} from '../../utils/konva-circle-utils';
import { Button, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import { RainbowFill } from '../../graphics/rainbowfill';
import { ACTIONS, harmoniesReducer, SHD_ACTIONS, shadeReducer } from '../reducers/color-wheel-reducer';
import { SatLumCircle } from '../../graphics/sat-lum-circle-graphic';
import { getDefaultShades, getOneShadeColor } from '../utils/shade-utils';



export const ColorCircleKonva = (props) => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const [radius, setRadius] =  useState(Math.round(windowWidth/3));
    const [satLumRadius, setSatLumRadius] = useState(Math.round(radius/3))
    const [centerXY, setCenterXY] = useState([Math.round(windowWidth * (5/24)), Math.round(windowHeight/2)])
    
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
    
    //state variables requiring initalizatin  of the reducers because we added a whole new thing to handle it cuz we're cute :)    
    const [complement, setComplement] = useState(getComplement(numHarmonies, angle, dist, centerXY))
    
    const initStateHarms = getHarmonies(numHarmonies, angle, dist, centerXY )
    const [harmonies, dispatch] = useReducer(harmoniesReducer, initStateHarms)

    //refs
    const harmoniesRef = useRef({});
    const shadesRef = useRef({})
    const handlerCircle = useRef(null)
    const stage = useRef(null)
 
   
    //reducer actions
    //we store some of the values we need for mathematical calculations and color calculations as regular
    //degular state variables. but there's some more complex calculations we want to keep out of the useEffect 
    //hook to keep it cleaner, and the values of which we want to access in an iterable and organized way.
    //with useReducer we are able to keep all of the calculations in one place and store information as a
    //json
    const updateAllHarmonies = () => {  //calculate all harmonies of chosen color based on classical color theory relationships
            dispatch({
               type: ACTIONS.UPDATE_ALL_HARMONIES,
               numHarmonies, 
               angle,
               dist,
               centerXY
           })
    }

    const updateHarm = (ix) => {    //update one Harmony for custom made
        const harm = harmoniesRef.current[ix]
        if (harm){ //cuz we set harmRef initially to null / empty object
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

    const updateShade = (ix) => {   //update one shade for individual manipulation
        const shade = shadesRef.current[ix]
        if (shade){ //see above
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
    
    const updateAllShades = (ix) => {   //update all shades in the same manner as the currently selected one
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


    const addHarm = (i) => {    //create a placeholder for handling when we are moving from 3 to 4 
        dispatch(
            {type: ACTIONS.ADD_HARMONY, 
            key: i,    
            centerXY
                })
    }


    //event methods: mouse drag
    const handlerDrag = () => {

        if (handlerCircle.current) {
            setHandleCenter([handlerCircle.current.attrs.x, handlerCircle.current.attrs.y]) // update it for our other calculations which use it
            const deltas = getDeltas(handleCenter, centerXY)
            setAngle(getAngle(deltas))
            setDist(getDist(deltas))
            setComplement(getComplement(numHarmonies, angle, dist, centerXY))   

            setFocusHue(angle)            
        }
    }

     //helper methods for keeping handler drag within circle
     const bindHandlerDrag = (pos) => {
        const x = centerXY[0]
        const y = centerXY[1]
        const deltas = getDeltas([pos.x, pos.y], [x,y])
        const distance = getDist(deltas)
        const scale = (radius/2) / distance
        const scale2 =  ((radius * 2/3)/2) / distance
        
       
        
        if (scale < 1) {  //is the radius / new dist < 1 --> outside circle
                return {
                    y: Math.round((pos.y - y) * scale + y),
                    x: Math.round((pos.x - x) * scale + x),
                };
            
        } else {
            if (scale2 < 1) {         //is the 2ndradius / dist < 1 --> outside second circle
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

        if (scale < 1) {    //see above
            return {
                y: Math.round((pos.y - y) * scale + y),
                x: Math.round((pos.x - x) * scale + x),
            };
        
        } else {
            return pos
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
    ///created some/most of the graphics as returns from helper methods mainly
    ///bc i wanted to keep the functional components return as clean as possible
    ///so i wouldn't get lost inside the return lol

    const createHarmCircle = (harmony, index) => {      //circular handles for harmonies = takes a harmony color and maps it to
                                                        //to a position on our hue circle 
                                                        //for the primary color i did in the return cuz there's just one
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
                    fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)} />
            )
    }

    const createShadeHandle = (shade, index) => {           //maps saturation and light values to a circle
        const assignRef = (el) => {shadesRef.current[index]= el}
        const hue = focusHue
        let stroke
        index === 2 ? stroke = 'black' : stroke = 'gray'

        let width
        index === 2 ? width = radius/12 : width = radius/15
            return( 
                
                <>
                < Circle 
                    ref={assignRef}
                    key={shade.key} 
                    x= {shade.x} 
                    y= {shade.y}
                    stroke={stroke}
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
                    width={width} 
                    height={width}
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

    const renderComplement = () => {   
        return(<Circle 
        key={complement.key} 
        x={complement.x} 
        y = {complement.y} 
        width={radius/15} 
        height={radius/15} 
        stroke={'white'}
        strokeWidth={5}
        fill={getOneShadeColor(complement.angle, shades[2].s, shades[2].l)} />)
    }


    //GRAPHICAL ELEMENTS the big square and rectangular things 
    const createPrimaryShades = (x,y, height, width) => {
    //maps our user inputs on the shade and color wheels to colors
    //we love you user :)
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
                    fill={getOneShadeColor(angle, shades[2].s, shades[2].l)} />
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
                    
                    fill={getOneShadeColor(angle, shades[2].s, shades[2].l)} />
                    {createPrimaryShades(x, y, height, width)}
                    </>
            )
        }
    }


    //the next are graphical elements for the harmonic colors
    //the colors are generated via user input or
    //calculated based on their input re: the primary colors

    const create2NDShades = (x,y,height, width) => {
        const hue = harmonies[0].angle
        return (
            <>
            <Rect 
                x={x + (width * 5/9)}
                y={y + (height * 10/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
            <Rect 
                x={x + (width * 5/9)}
                y={y + (height * 7/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
             <Rect 
                x={x + (width * 5/9)}
                y={y + (height * 4/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />

            <Rect 
                x={x + (width * 5/9)}
                y={y + (height * 1/15)}
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
                y={y + (height * 5/9)}
                x={x + (width * 10/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
              <Rect 
                y={y + (height * 5/9)}
                x={x + (width * 7/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
             <Rect 
                y={y + (height * 5/9)}
                x={x + (width * 4/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />
            <Rect 
                y={y + (height * 5/9)}
                x={x + (width * 1/15)}
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

    const create4THshades = (x, y, height, type) => {
        const width = height;
        let hue
        if (type === 'primary') {
            hue = angle;
        } else if (type === '4th harm') {
            hue = harmonies[2].angle 
        } else {
            hue = complement.angle
        }
        return (
            <>
            <Rect 
                x={x + width * 4/20}
                y={y + (height * (14/20))}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 5}
                width = {width / 5}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
            <Rect 
                x={x + width * (9/20)}
                y={y + height * (14/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
            <Rect 
                x={x + (width * 7/10)}
                y={y + (height * 9/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />

<Rect 
                x={x + (width * 7/10)}
                y={y + (height * 4/20 )}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(hue, shades[4].s, shades[4].l)}
            />     
        

            </>
        )
    }

    const create4THHarmSquare = () => {
        const x = windowWidth / 2 + (radius * (2/3))
        const y = centerXY[1] - (radius / 2 ) + (radius *(2/3))
        const height = radius / 3 
        if (numHarmonies === 3) {
            if (harmonies[2]) {
                let harmony = harmonies[2]
            return (
                    <>
                    <Rect
                        key={harmony.key}
                        x={x}
                        y={y}
                        height={height}
                        width={height}
                        fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)}
                     />
                    {create4THshades(x, y, height, '4th harm')}
                    </> )
            }
        } else if (toggleComplement) {
            return (
                <>
                <Rect
                        key={'complement'}
                        x={x}
                        y={y}
                        height={height}
                        width={height}
                        fill={getOneShadeColor(complement.angle, shades[2].s, shades[2].l)}
                    />
                {create4THshades(x, y, height, 'complement')}
                </>
            )
        } else {
            return (
                <>
                <Rect
                x={x}
                y={y}
                height={height}
                width={height}
                fill={getOneShadeColor(angle, shades[2].s, shades[2].l)}
                />
                {create4THshades(x, y, height, 'primary')}

                </>
            )
        }

    

    }



    useEffect( () => {
        !toggleHarmonies && updateAllHarmonies()

        if (toggleHarmonies) {
            for (let i = 0; i < numHarmonies; i++) {
                if (Object.values(harmonies).length < numHarmonies && !harmonies[i])
                { addHarm(i) }            
            }
        }
        if (numHarmonies === 3) {
            setToggleComplement(false);
        }            

    }, [toggleHarmonies, numHarmonies, angle, shades, toggleShades, focusHue])

   //image downloads:
         // function from https://stackoverflow.com/a/15832662/512042
        const downloadURI = (uri, name) => {
            var link = document.createElement('a');
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
    


    return (
        <>
        <Stage 
            ref={stage} 
            width={window.innerWidth} 
            height={window.innerHeight} >
                <Layer listening={false}>   
                    {/* this layer is not listening for any user input which improves performance,
                    so our HTML elements and graphical components which are not being directly manipulated
                    will be placed her*/}
                
                <Html transform={true} 
                    divProps={{
                        style: {
                            display: "flex",
                            alignItems: "center",
                        }
                    }}>

                    {/*Select for number of harmonies - just fyi these notes are mainly for myself
                    to not get lost in the sauce*/}
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel># of Harmonies</InputLabel>
                    <Select
                    value={numHarmonies}
                    onChange={(e) => {
                        setNumHarmonies(e.target.value)
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
                    <Button
                        variant="contained"
                        onClick={ () => {
                            let dataURL = stage.current.toDataURL({ pixelRatio: 1 });
                            downloadURI(dataURL, 'stage.png');
                            }}
                        >
                            Save your palette
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
                    width={radius/8} 
                    height={radius/8}
                    stroke={'black'}
                    strokeWidth={5}
                    fill={getOneShadeColor(angle, shades[2].s, shades[2].l)} 
                    draggable 
                    dragBoundFunc={bindHandlerDrag} 
                    onDragMove={handlerDrag}
                />

                {/* This text box is mainly here for debug and it's commented out 
                but it's here now mainly in honor of how much I used it while debugging
                and fixing my mathetmatical calculations both in mapping user input and 
                displaying it for the automatic modes. */}
                {/* <Text 
                    key={'yalla'} 
                    x={handleCenter[0]}
                    y={handleCenter[1]} 
                    text={`Angle: ${angle} Location: ${handleCenter} From Formula: ${getCirclePoint(angle, dist, centerXY)} Sat: ${saturation}`}/>               */}
                                        

                {/* below are from all of the component creator helper methods
                we detailed above */}
                {harmonies && renderHarmonies()}
                {shades && renderShadeHandles()}
                {(toggleComplement && complement) && renderComplement()}
                </Layer>

               
        </Stage>
        </>
    )
    

}