import React, { useState } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Circle } from 'react-konva';
const ColorCircleKonva = (props) => {
    //state variables
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const [centerXY] = useState([95, 45])
    const [deltaXY, setDeltaXY] = useState([])
    const [radius] = useState(40)
    const [angle, setAngle] = useState(0)
    const [wheelColor, setWheelColor] = useState('rgb(255,50,50)')
    const [harmonies, setHarmonies] = useState([0,0,0])
    const [handleCenter, setHandleCenter] = useState([95,5])

    return (
        <>
        <Stage width={window.innerWidth} height={window.innerHeight}></Stage>
            <Layer>
                <Circle radius=50 />
            </Layer>
    )
}

export default ColorCircleKonva