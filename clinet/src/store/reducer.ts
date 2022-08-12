import {ADD, REMOVE, SAVESTATE} from './function-define'
import State from './state'

export default function reducer(state: {
    camera: string,
    camera_list: Array<string>,
    code_page_state: {
        codeonedit:string,
        codeupload:string,
        title:string
    } | null } = State,
    action: any) {
    switch(action.type) {
        case ADD:
            state.camera_list.push(action.camera)
            return {
                camera: action.camera,
                camera_list: state.camera_list,
                code_page_state: state.code_page_state
            }
        case REMOVE:
            state.camera_list.splice(state.camera_list.indexOf(action.camera),1)
            return {
                camera: '',
                camera_list: state.camera_list,
                code_page_state: state.code_page_state
            }
        case SAVESTATE:
            return {
                camera: state.camera,
                camera_list: state.camera_list,
                code_page_state: action.snapshot
            }
        default:
            return state
    }
}