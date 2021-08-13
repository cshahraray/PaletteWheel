import React, { useEffect, useRef, useState } from 'react'
import { drawCircle } from '../utils/canvas-utils'
import { getAngle, angle2Color, getHarmonies, getDeltas, getCirclePoint } from '../utils/circle-utils'
import { hsv2rgb } from '../utils/colorspace-utils'
import { ColorSquare } from './color-square'

const ColorCircle = props => {
  //state variables
  const canvasRef = useRef(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [centerXY] = useState([95, 45])
  const [deltaXY, setDeltaXY] = useState([])
  const [radius] = useState(40)
  const [angle, setAngle] = useState(0)
  const [wheelColor, setWheelColor] = useState('rgb(255,50,50)')
  const [harmonies, setHarmonies] = useState([0,0,0])
  const [handleCenter, setHandleCenter] = useState([95,5])





  //canvas methods

  
  
  
  //event methods
  const onClick = (e) => {
      setMouseX(e.offsetX)
      setMouseY(e.offsetY)
      setDeltaXY(getDeltas(mouseX, mouseY, centerXY))
      setAngle(getAngle(deltaXY))
      setHandleCenter(getCirclePoint(angle, radius, centerXY))
      setWheelColor(angle2Color(angle))
      setHarmonies(getHarmonies(angle, 3))
  }

  
  //react methods
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    // resizeCanvasToDisplaySize(canvas)
    canvas.addEventListener('click', onClick)
    
    //Our first draw
    context.fillStyle = `${wheelColor}`
    drawCircle(context, centerXY, radius)
    context.fillStyle = 'blue'
    drawCircle(context, handleCenter, 5)
    return () => canvas.removeEventListener('click', onClick)
  },  )

  const renderHarmonies = () => {
    const arr = harmonies.map( (harmony, ix) => (
       <ColorSquare key={ix} color={angle2Color(harmony)} />
    ))

    return arr
  
    }

  return (
    <>
    <canvas ref={canvasRef} {...props}/>
    {mouseX}
    <br></br>
    {mouseY}
    <br></br>
    {centerXY}
    <br></br>
    {angle}
    <br></br>
    {wheelColor}
    <br></br>
    {harmonies}
    {harmonies.map( harmony => <p>{angle2Color(harmony)}</p>)}
        <br></br>
        {renderHarmonies()}

        {angle2Color(90)}
        {angle2Color(180)}

    </>
  )
}
export default ColorCircle