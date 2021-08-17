import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Stage, Layer, Circle, Text } from "react-konva";
import {Html} from "react-konva-utils"
// import {  } from '../utils/circle-utils';
// import { getCirclePoint } from '../utils/circle-utils';
import { getCirclePoint, getDeltas, angle2Color, getAngle, angleSat2Color, getDist, dist2Sat, getHarmonies, getComplement, getHarmonyObj } from '../../utils/konva-circle-utils';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';
//action consatants
const ACTIONS = {
    UPDATE_HARMONIES: 'UPDATE_HARMONIES',
    UPDATE_HARMONY: 'UPDATE_HARMONY',
    GET_HARMONIES: 'GET_HARMONIES'

}
function reducer(state, action) {
    // console.log(state)
    let newState;
    switch(action.type) {
        case ACTIONS.UPDATE_HARMONIES:
            let {numHarmonies, angle, dist, saturation, centerXY} = action;
            newState = getHarmonies(numHarmonies, angle, dist, saturation, centerXY);
            // console.log(newState)
            return newState;
        case ACTIONS.UPDATE_HARMONY:
            const pointXY = [action.x, action.y];
            const ix = action.ix;
            const harmDeltas = getDeltas(pointXY, action.centerXY)
            const harmDist = getDist(harmDeltas)
            const harmAngle = getAngle(harmDeltas)
            const harmSat = dist2Sat(harmDist, action.radius)
            const newHarm = getHarmonyObj(ix, harmAngle, harmSat, action.centerXY)
            newState = Object.assign({}, state, state[ix]= newHarm)
            // console.log(newState)
            return newState;
        case ACTIONS.GET_HARMONIES:
            // console.log(state)
            return state
        default:
            // console.log(state)
            return state
    }
}

const windowHeight = window.innerHeight
const windowWidth = window.innerWidth

export const ColorCircleKonva = (props) => {
    const {radius} = props;
    const [centerXY] = useState([200, 200])
    const [angle, setAngle] = useState(0)
    const [dist, setDist] = useState(radius)
    const [saturation, setSaturation] = useState(dist2Sat(dist, radius))
    const [numHarmonies, setNumHarmonies] = useState(2)
    const [toggleComplement, setToggleComplement] = useState(false)
    const [wheelColor, setWheelColor] = useState(angle2Color(angle))
    const [complement, setComplement] = useState(getComplement(numHarmonies, angle, dist, saturation, centerXY))
    const [handleCenter, setHandleCenter] = useState(getCirclePoint(0, dist, centerXY))
    const [toggleHarmonies, setToggleHarmonies] = useState(false)
    const [updateRender, setUpdateRender] = useState(0)
    //reducer variable
    const initState = getHarmonies(numHarmonies, angle, dist, saturation, centerXY )
    const [harmonies, dispatch] = useReducer(reducer, initState)

    //refs
    const harmoniesRef = useRef([]);
    const handlerCircle = useRef(null)
    const stage = useRef(null)
 
    //helper methods for keeping handler drag within circle
    const bindHandlerDrag = (pos) => {
        const x = centerXY[0]
        const y = centerXY[1]
        const scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
        if (scale < 1)
          return {
            y: Math.round((pos.y - y) * scale + y),
            x: Math.round((pos.x - x) * scale + x),
          };
        else return pos;
      }

    //promises
    const fetchHarmonies = () => {
        await dispatch({
            type: ACTIONS.GET_HARMONIES}
        )
    }
    //event methods
    const drag = () => {

        if (handlerCircle.current) {
            setHandleCenter([handlerCircle.current.attrs.x, handlerCircle.current.attrs.y])}
        }

    

        //event methods for inputs
    const handleHarmoniesInput = (e) => {
        setNumHarmonies(e.target.value)
    }

    const handleToggleHarmoniesInput = (e) => {
        setToggleHarmonies(e.target.value)
    }

    const handleToggleComplementInput = (e) => {
        setToggleComplement(numHarmonies === 3 ? true : !toggleComplement)
    }

    //helper methods / component-'constructors'

    const customHarmCircle = (harmony, ref, index) => {
                    const assignRef = (el) => {harmoniesRef.current.push(el)}
            return(  
                    < Circle 
                        ref={assignRef}
                        key={harmony.key} 
                        x= {harmony.x} 
                        y= {harmony.y}
                        draggable
                        dragBoundFunc={bindHandlerDrag}
                        onDragMove={
                            () => { 
                                console.log("before func def")
                                const updateHarm = async (ix) => {
                                    const harm = ref.current[ix]
                                    if (harm){
                                        console.log("inside condiitonal")
                                        await dispatch({
                                                        type: ACTIONS.UPDATE_HARMONY,
                                                        x: harm.attrs.x,
                                                        y: harm.attrs.y,
                                                        ix: ix,
                                                        centerXY: centerXY,
                                                        radius: radius
                                        })
                                    }
                                }    
                                updateHarm(harmony.key)
                            }
                        }
                        width={30} 
                        height={30} 
                        fill={harmony.fill} /> )
            }

    const fixedHarmsCircle = (harmony, ref) => {
        return (
            < Circle 
                ref={ref}
                key={harmony.key} 
                x={harmony.x} 
                y = {harmony.y} 
                width={30} 
                height={30} 
                fill={harmony.fill} />
        )
    }

    const renderHarmonies = () => {
        const harms = Object.values(harmonies)
        const renderedHarms = []

        for (let i = 0; i < numHarmonies; i++) {
            renderedHarms.push(customHarmCircle(harms[i], harmoniesRef, i))
        }
        // return harms.map((harmony, ix) =>
        //     customHarmCircle(harmony, harmoniesRef)
        // )

        return renderedHarms
    }
    

    

    useEffect( () => {
        const deltas = getDeltas(handleCenter, centerXY)
 
        setAngle(getAngle(deltas))
        setDist(getDist(deltas))
        setSaturation(dist2Sat(dist, radius))

        
        setWheelColor(angleSat2Color(angle, saturation))
        // console.log(harmoniesRef)

        // if (!toggleHarmonies) {
        //     dispatch(
        //         {
        //         type: ACTIONS.UPDATE_HARMONIES,
        //         numHarmonies, 
        //         angle, 
        //         dist, 
        //         saturation, 
        //         centerXY
        //         })
        // }
           
           fetchHarmonies()

        }, [handleCenter, numHarmonies, toggleComplement, toggleHarmonies])


    return (
        <>
        <Stage 
            ref={stage} 
            width={windowWidth} 
            height={windowHeight} >
                <Layer key={'inputs'}>
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
                    onChange={handleHarmoniesInput}
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

            </Layer>
            <Layer key={'wheel'}> 
                   {/* color picker circle */}
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
                                        

                {renderHarmonies()}
                {/* { customHarmCircle(Object.values(harmonies)[0], harm1Ref)} */}

                {(toggleComplement && complement) &&
                <Circle 
                key={complement.key} 
                x={complement.x} 
                y = {complement.y} 
                width={30} 
                height={30} 
                fill={complement.fill} />

                }


            </Layer>
            
        </Stage>
        </>
    )
}