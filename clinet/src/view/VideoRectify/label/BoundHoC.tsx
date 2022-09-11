import React, { ComponentType, forwardRef } from 'react'
import { CRS, LatLngBounds } from 'leaflet'

export const maxZoom:number = 7

interface propsType {
    height: number
    width: number
    url: string
    label: {
        name: string | null,
        color: string | null
    }
    forwardedRef: React.ForwardedRef<any>
}

interface propsTypeAnces {
    height: number
    width: number
    bounds: any
    ref: any
    url: string
    label: {
        name: string | null,
        color: string | null
    }
}

interface propsForward {
    height: number
    width: number
    url: string
    label: {
        name: string | null,
        color: string | null
    }
}

export function withBounds(Comp:ComponentType<propsTypeAnces>) {
    class CalcBoundsLayer extends React.PureComponent<propsType,{}> {
        calcBounds() {
            const crs = CRS.Simple
            const {height, width} = this.props
            const southWest = crs.unproject({x:0, y:height}, maxZoom - 1)
            const northWest = crs.unproject({x:width, y:0}, maxZoom - 1)
            const bounds = new LatLngBounds(southWest, northWest)
            return bounds
        }

        render() {
            const { forwardedRef, ...rest } = this.props
            const bounds = this.calcBounds();
            if(!bounds)
                return null
            return <Comp bounds={bounds} ref={forwardedRef} {...rest}/>
        }
    }

    return forwardRef((props:propsForward, ref) => 
        <CalcBoundsLayer {...props} forwardedRef={ref}/>
    )
}
