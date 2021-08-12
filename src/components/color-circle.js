import React, { useEffect, useRef, useState } from 'react'
import { rad2Deg } from '../utils/circle-math-utils'
import { hsv2rgb } from '../utils/colorspace-utils'
import { ColorSquare } from './color-square'

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
  const [harmonies, setHarmonies] = useState([0,0,0])
  
  //helper methods
  const getAngle = () => {
    return rad2Deg(Math.atan2(deltaY, deltaX))
  }

  const angle2Color = (angle) => {
    const rgbArr = hsv2rgb(angle, .5, .5)
    return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`
  }

  const getHarmonies = (numHarmonies) => {
    const angleOffset = 360/(numHarmonies+1);
    const harmoniesArr = [];

    for (let i = 0; i < numHarmonies; i++) {
      if (i === 0) {
        harmoniesArr.push((angle + angleOffset) % 360)
      } else {
        harmoniesArr.push((harmoniesArr[i-1] + angleOffset) % 360)
      }
    }
    console.log(harmoniesArr)
    return harmoniesArr;

  }
  //canvas methods

  const resizeCanvasToDisplaySize = (canvas) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    // console.log('resize canvas')
    // console.log(canvas.getBoundingClientRect())
    // const { width, height } = canvas.getBoundingClientRect()

    // if (canvas.width !== width || canvas.height !== height) {
    //   canvas.width = width
    //   canvas.height = height
    //   return true // here you can return some usefull information like delta width and delta height instead of just true
    //   // this information can be used in the next redraw...
    // }
    // return false
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
      setHarmonies(getHarmonies.bind(this)(3))
  }

  
  //react methods
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    // resizeCanvasToDisplaySize(canvas)
    canvas.addEventListener('click', onClick)
    
    //Our first draw
    context.fillStyle = `${wheelColor}`
    drawCircle(context)
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