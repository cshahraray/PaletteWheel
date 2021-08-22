import { hslToRgb } from "@material-ui/core"
import { getDeltas, getDist } from "../../utils/konva-circle-utils"

//math helper methods
export const getDistFromSat = (sat, radius) => {
    //sat = dist / radius; therefore: sat * radius = dist;
    const dist = (sat/100) * radius
    return dist;
}

export const getAngleFromLightness = (lightness) => {
    //lightness = angle / 360; therefore: lightness * 360 = angle ?
    
    const angle = (lightness/100) * 360;

    return angle;
}

export const getSatFromDist = (distance, radius) => {
    const sat = (distance / radius) * 100;
    return sat;
}

export const getLightnessFromAngle = (angle) => {
    const light = (angle/360) * 100;
    return light;
}

//map shade saturation

export const getDefaultShades = () => {
    const lightness = [10, 20, 35, 50, 75]
    const saturation = 100
    let shadeObj = {}

    lightness.map( (lightVal, ix) => shadeObj[ix] = {
        key: ix,
        l: lightVal,
        s: saturation,   
    })
    

    return shadeObj
}

export const getAllShades = (hue, lightArr, satArr) => {
    const shadeArr = []
    if (Array.isArray(satArr)) {
        lightArr.map( (lightVal, ix) => shadeArr.push((hslToRgb(`hsl(${hue}, ${satArr[ix]}, ${lightVal})`))))
    } else {
        lightArr.map( (lightVal, ix) => shadeArr.push((hslToRgb(`hsl(${hue}, ${satArr}, ${lightVal})`))))
    }

    return shadeArr;
}

export const getOneShadeColor = (hue, sat, lightness) => {
    return hslToRgb(`hsl(${hue}, ${sat}, ${lightness})`)
}


export const updateLightVal = (shade, changeInVal) => {
    shade.l += changeInVal;
    return shade.l;
}

export const updateSatVal = (shade, changeInVal) => {
    shade.s += changeInVal;
    return shade.s;
}