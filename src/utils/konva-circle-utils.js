export const getDeltas = (handlerXY, centerXY) => {
    const deltaX = handlerXY[0] - centerXY[0];
    const deltaY = handlerXY[1] - centerXY[1];

    return [deltaX, deltaY];
}