import { ADD, REMOVE } from './function-define'

export const onAdd = (payload: string) => {
    return { type: ADD, camera: payload }
}
export const onRemove = (payload: string) => { 
    return { type: REMOVE, camera: payload }
}