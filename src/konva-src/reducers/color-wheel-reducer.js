import { dist2Sat, dummyHarmonyObj, getAngle, getCirclePoint, getDeltas, getDist, getHarmonies, getHarmonyObj } from "../../utils/konva-circle-utils";
import { getAngleFromLightness, getDistFromSat, getLightnessFromAngle, getSatFromDist } from "../utils/shade-utils";

export const ACTIONS = {
    UPDATE_ALL_HARMONIES: 'UPDATE_ALL_HARMONIES',
    UPDATE_HARMONY: 'UPDATE_HARMONY',
    GET_HARMONIES: 'GET_HARMONIES',
    ADD_HARMONY: 'ADD_HARMONY'

}

export function harmoniesReducer(state, action) {

    let newState;
    switch(action.type) {
        case ACTIONS.UPDATE_ALL_HARMONIES:
            let {numHarmonies, angle, dist, centerXY} = action;
            console.log(centerXY)
            newState = getHarmonies(numHarmonies, angle, dist, centerXY);
            // console.log(newState)
            return newState;
        case ACTIONS.UPDATE_HARMONY:
            const pointXY = [action.x, action.y];
            const ix = action.ix;
            const harmDeltas = getDeltas(pointXY, action.centerXY)
            const harmDist = getDist(harmDeltas)
            const harmAngle = getAngle(harmDeltas)
            const newHarm = getHarmonyObj(ix, harmAngle, action.centerXY)
            newState = Object.assign({}, state, {[ix]:  newHarm})
            return newState;
        case ACTIONS.ADD_HARMONY:
            newState = Object.assign({}, state)
            newState[action.key]= dummyHarmonyObj(action.key, action.centerXY)
            console.log('Add harmony')
            console.log(newState)
            return newState;
            
        case ACTIONS.GET_HARMONIES:
            return state
        default:
            // console.log(state)
            return state
    }
}

export const SHD_ACTIONS = {
    UPDATE_ALL_SHADES: 'UPDATE_ALL_SHADES',
    UPDATE_SHADE: 'UPDATE_SHADE',
}

// {
//     lightnessVals: [10, 20, 35, 50, 75],
//     saturationVals: [100, 100, 100, 100, 100]

// }


export function shadeReducer(state, action) {
    Object.freeze(state)
    let newState = Object.assign({}, state)
    const pointXY = [action.x, action.y];
    const ix = action.ix;
    const shadeDeltas = getDeltas(pointXY, action.centerXY)
    const shadeDist = getDist(shadeDeltas)
    const shadeAngle = getAngle(shadeDeltas)
    const shadeSat = getSatFromDist(shadeDist, action.radius)
    const shadeLight = getLightnessFromAngle(shadeAngle)
   switch(action.type) {
    case SHD_ACTIONS.UPDATE_SHADE:
        newState[ix].l = shadeLight
        newState[ix].s = shadeSat
        return newState;
    case SHD_ACTIONS.UPDATE_ALL_SHADES:
        console.log("update all shades")
        const lightValChange = shadeLight - state[ix].l
        const satValChange = shadeSat - state[ix].s
        let ang, distance, posXY
        for (let ix = 0; ix < Object.values(state).length; ix++) {
            newState[ix].l += lightValChange;
            newState[ix].s += satValChange;

            if (newState[ix].l > 100) {
                newState[ix].l %= 100;
            } else if (newState[ix].l < 0) {
                newState[ix].l += 100
            }

    
            
            ang = getAngleFromLightness(newState[ix].l, action.radius)
            distance = getDistFromSat(newState[ix].s, action.radius)
            posXY = getCirclePoint(ang, distance, action.centerXY)
            newState[ix].x = posXY[0]
            newState[ix].y = posXY[1]
            newState[ix].angle = ang
            newState[ix].distance = distance
        }

        return newState;

        

    default:
        return state;
   }

}