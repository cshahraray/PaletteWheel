import React, { useEffect, useRef, useState } from 'react'
import { rad2Deg } from '../utils/circle-math-utils'
import { hsv2rgb } from '../utils/colorspace-utils'

const ColorCircle = props => {
  //state variables
  const canvasRef = useRef(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [centerXY] = useState([95, 45])
  const [radius] = useState(40)
  const [deltaX, setDeltaX] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  const [angle, setAngle] = useState(0)
  const [wheelColor, setWheelColor] = useState('rgb(255,50,50)')
  
  //helper methods
  const getAngle = () => {
    return rad2Deg(Math.atan2(deltaY, deltaX))
  }

  const angle2Color = () => {
    let rgbArr = hsv2rgb(angle, .5, .5)
    console.log(angle)
    console.log(rgbArr)
    return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`
  }

  //canvas methods

  const resizeCanvasToDisplaySize = (canvas) => {
    
    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      return true // here you can return some usefull information like delta width and delta height instead of just true
      // this information can be used in the next redraw...
    }
    return false
  }

  const drawCircle = (ctx) => {
      ctx.beginPath();
      ctx.arc(centerXY[0], centerXY[1], radius, 0, 2 * Math.PI);
      ctx.stroke();      
      ctx.fill()
  }
  
  //event methods
  const onClick = (e) => {
      setMouseX(e.offsetX)
      setMouseY(e.offsetY)
      setDeltaX(mouseX - centerXY[0])
      setDeltaY(mouseY - centerXY[1])
      setAngle(getAngle())
      setWheelColor(angle2Color())
  }
  
  //react methods
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.addEventListener('click', onClick)
    //Our first draw
    context.fillStyle = `${wheelColor}`
    drawCircle(context)

    return () => canvas.removeEventListener('click', onClick)
  }, )
  return (
    <>
    <canvas ref={canvasRef} {...props}/>
    {canvasRef.current && resizeCanvasToDisplaySize(canvasRef.current)}
    {mouseX}
    {mouseY}
    <br></br>
    {centerXY}
    <br></br>
    {getAngle()}
    {wheelColor}
    </>
  )
}

export default ColorCircle