import {ADD, REMOVE} from './function-define'
import State from './state'

export default function reducer(state:{camera:string,camera_list:Array<string>} = State, action:any) {
    switch(action.type) {
        case ADD:
            state.camera_list.push(action.camera)
            return {
                camera: action.camera,
                camera_list: state.camera_list
            }
        case REMOVE:
            state.camera_list.splice(state.camera_list.indexOf(action.camera),1)
            return {
                camera: '',
                camera_list: state.camera_list
            }
        default:
            return state
    }
}