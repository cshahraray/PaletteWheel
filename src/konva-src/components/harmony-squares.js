import React from 'react'
import { Rect } from 'react-konva'

export const HarmonySquares = (props) => {
    const {harmonies, numHarmonies} = props
    const renderHarmonieSquares = () => {
        let harms = Object.values(harmonies)
        let renderedHarms = []
        harms.map((harmony, ix) => harmony.key < numHarmonies ? renderedHarms.push(harmony) : "")
        return renderedHarms.map( (harmony,ix) => createHarmonySquare(harmony, 600+(200*ix), 300+(200*ix) ))
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

    return(
        <>
       {renderHarmonieSquares()}
       </>
    )
}

