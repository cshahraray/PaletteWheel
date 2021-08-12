//color-wheel

export const drawCircle = (ctx, centerCoords, radius) => {
    ctx.beginPath();
    ctx.arc(centerCoords[0], centerCoords[1], radius, 0, 2 * Math.PI);
    ctx.stroke();      
    ctx.fill()
}