import { dist2Sat, dummyHarmonyObj, getAngle, getDeltas, getDist, getHarmonies, getHarmonyObj } from "../../utils/konva-circle-utils";

export const ACTIONS = {
    UPDATE_ALL_HARMONIES: 'UPDATE_ALL_HARMONIES',
    UPDATE_HARMONY: 'UPDATE_HARMONY',
    GET_HARMONIES: 'GET_HARMONIES',
    ADD_HARMONY: 'ADD_HARMONY'

}

export function reducer(state, action) {

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