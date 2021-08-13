//color-wheel

export const drawCircle = (ctx, centerCoords, radius) => {
    ctx.beginPath();
    ctx.arc(centerCoords[0], centerCoords[1], radius, 0, 2 * Math.PI);
    ctx.stroke();      
    ctx.fill()
}

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

  // const drawCircle = (ctx) => {
  //     ctx.beginPath();
  //     ctx.arc(centerXY[0], centerXY[1], radius, 0, 2 * Math.PI);
  //     ctx.stroke();      
  //     ctx.fill()
  // }