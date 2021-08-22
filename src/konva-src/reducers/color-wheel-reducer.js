import { dist2Sat, dummyHarmonyObj, getAngle, getDeltas, getDist, getHarmonies, getHarmonyObj } from "../../utils/konva-circle-utils";
import { getLightnessFromAngle, getSatFromDist } from "../utils/shade-utils";

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
            let {numHarmonies, angle, dist, saturation, centerXY} = action;
            newState = getHarmonies(numHarmonies, angle, dist, saturation, centerXY);
            // console.log(newState)
            return newState;
        case ACTIONS.UPDATE_HARMONY:
            const pointXY = [action.x, action.y];
            const ix = action.ix;
            const harmDeltas = getDeltas(pointXY, action.centerXY)
            const harmDist = getDist(harmDeltas)
            const harmAngle = getAngle(harmDeltas)
            const harmSat = dist2Sat(harmDist, action.radius)
            const newHarm = getHarmonyObj(ix, harmAngle, harmSat, action.centerXY)
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
    let newState

   switch(action.type) {
       case SHD_ACTIONS.UPDATE_SHADE:
        newState = Object.assign({}, state)
        const pointXY = [action.x, action.y];
        const ix = action.ix;
        const shadeDeltas = getDeltas(pointXY, action.centerXY)
        const shadeDist = getDist(shadeDeltas)
        const shadeAngle = getAngle(shadeDeltas)
        const shadeSat = getSatFromDist(shadeDist, action.radius)
        const shadeLight = getLightnessFromAngle(shadeAngle)
    
        newState[ix] = {
            key: ix,
            l: shadeLight,
            s: shadeSat
        }

        console.log(newState)
        return newState;

        default:
            return state;
   }

}