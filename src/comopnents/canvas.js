import React, { useEffect, useRef } from 'react'

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  const drawCircle = (ctx) => {
      ctx.beginPath();
      ctx.arc(95, 50, 40, 0, 2 * Math.PI);
      ctx.stroke();
  }
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //Our first draw  
    context.fillStyle = '#000000'
    drawCircle(context)
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas