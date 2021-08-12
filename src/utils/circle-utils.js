import { hsv2rgb } from '../utils/colorspace-utils'
//helper methods for mathematical calculations

export const rad2Deg = (radian) => {
    return (radian + Math.PI) / (2 * Math.PI) * 360;
}

export const getDeltas = (mouseX, mouseY, centerCoords) => {
    const deltaX = mouseX - centerCoords[0];
    const deltaY = mouseY - centerCoords[1];

    return [deltaX, deltaY];
}

export const getAngle = (mouseX, mouseY, centerCoords) => {
    const deltas = getDeltas(mouseX, mouseY, centerCoords);
    return rad2Deg(Math.atan2(deltas[0], deltas[1]))
}

//helper methods for color calculations

export const angle2Color = (angle) => {
    const rgbArr = hsv2rgb(angle, .5, .5)
    return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`
  }

export const getHarmonies = (angle, numHarmonies) => {
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
