import { hslToRgb } from "@material-ui/core"


export const getDefaultShades = (hue) => {
    const lightness = [10, 20, 35, 50, 75]
    const saturation = 100
    const shadeArr = []

    lightness.map( lightVal => shadeArr.push(hslToRgb(`hsl(${hue}, ${saturation}, ${lightVal})`)))
    

    return shadeArr
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

export const getOneShade = (hue, lightness, sat) => {
    return hslToRgb(`hsl(${hue}, ${sat}, ${lightness})`)
}

