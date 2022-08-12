import { ADD, REMOVE, SAVESTATE } from './function-define'

export const onAdd = (payload: string) => {
    return { type: ADD, camera: payload }
}
export const onRemove = (payload: string) => { 
    return { type: REMOVE, camera: payload }
}
export const onSaveState = (payload: {
    codeonedit: string,
    codeupload: string,
    title: string
} | null) => { 
    return { type: SAVESTATE, snapshot: payload }
}