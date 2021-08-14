import { hsv2rgb } from "./colorspace-utils";


//Circle Math helper methods:
//convert radians to degrees
export const rad2Deg = (radian) => {
    return (radian + Math.PI) / (2 * Math.PI) * 360;
}

///get dX dY for distance and angle calculations
//input: [X,Y]; [X,Y]
export const getDeltas = (pointXY, centerXY) => {
    const deltaX = pointXY[0] - centerXY[0];
    const deltaY = pointXY[1] - centerXY[1];

    return [deltaX, deltaY];
}

export const getDist = (deltaXY) => {
    const dXsquared = deltaXY[0] * deltaXY[0];
    const dYsquared = deltaXY[1] * deltaXY[1];

    return Math.sqrt(dXsquared + dYsquared);
}

//get angle of arc from center point


export const getAngle = (deltaXY2) => {
    return rad2Deg(Math.atan2(deltaXY2[0], deltaXY2[1]))
}


////given an angle (in degrees) return the
//corresponding color RGB values as string for fill
export const angle2Color = (angle) => {
    const rgbArr = hsv2rgb(angle, .5, .5)
    return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`
}

//given angle from center and distance from center
//map to hue and saturation values
//return RGB values as strig for fill

//scale distance of controllor from center of wheel
//to saturation values
export const dist2Sat = (deltaXY, radius) => {
    const dist = getDist(deltaXY);
    return (dist / radius)
}

export const angleSat2Color = (angle, sat) => {
    const rgbArr = hsv2rgb(angle, sat, .8);
    return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`;

}



export const getHarmonies = (numHarmonies, angle) => {
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

