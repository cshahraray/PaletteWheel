import React, { useEffect, useRef } from 'react'

export const ColorSquare = (...props) => {
    const canvasRef = useRef(null)
    

    const drawRect = (ctx) => {
        ctx.fillStyle = 'red'
        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.stroke();
        ctx.fill()
    }


    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        drawRect(context)
    })

    return (
        <canvas ref={canvasRef} {...props}/>
    )
}

