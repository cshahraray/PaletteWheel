import React, { useEffect, useRef, useState } from 'react'

const ColorCircle = props => {

  const canvasRef = useRef(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [centerXY] = useState([95, 45])
  const [deltaX, setDeltaX] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  
  const drawCircle = (ctx) => {
      ctx.fillStyle = 'red'
      ctx.beginPath();
      ctx.arc(centerXY[0], centerXY[1], 40, 0, 2 * Math.PI);
      ctx.stroke();      
      ctx.fill()

  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.addEventListener('click', onClick, false)
    //Our first draw  

    drawCircle(context)
  }, )
  
  const onClick = (e) => {
      setMouseX(e.offsetX)
      setMouseY(e.offsetY)
  }
  
  return (
    <>
    <canvas ref={canvasRef} {...props}/>
    {mouseX}
    {mouseY}
    <br></br>
    {centerXY}
    </>
  )
}

export default ColorCircle