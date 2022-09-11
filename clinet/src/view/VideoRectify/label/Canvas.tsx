import { CRS } from 'leaflet'
import { MapContainer, ImageOverlay, ZoomControl } from 'react-leaflet'
import HotKeys from 'react-hot-keys'
import React from 'react'
import { withBounds, maxZoom } from './BoundHoC'
import "leaflet/dist/leaflet.css"
import { useMap } from 'react-leaflet'
import { inherits } from 'util'

interface propType {
    height: number
    width: number
    url: string
    label: {
        name: string | null,
        color: string | null
    }
    bounds: any
    style: any
    ref: any
}

interface stateType {
    zoom: number
    selectedFigureId: (string | null)
    cursorPos: {
        lat:number
        lng:number
    }
}
class Canvas extends React.Component<propType, stateType> {
    constructor(props:any) {
        super(props)
        this.state = {
            zoom: 0,
            selectedFigureId: null,
            cursorPos: {lat:0,lng:0}
        }
        this.mapRef = React.createRef()
    }

    componentDidUpdate() {
        const { label } = this.props
        console.log(this.mapRef.current.boxZoom._container.style.cursor = label.name ? 'crosshair' : 'grab')
    }

    mapRef: any
    render() {
        const {
            height,
            width,
            url,
            bounds,
            label
        } = this.props
        const { zoom } = this.state;
        
        function MapHotKeys() {
            const map = useMap()
            return  <HotKeys
                keyName="backspace,del,-,=,left,right,up,down"
                onKeyDown={ key => {
                    
                    if (key === 'left') {
                        map.panBy([80, 0]);
                    }
                    if (key === 'right') {
                        map.panBy([-80, 0]);
                    }
                    if (key === 'up') {
                        map.panBy([0, 80]);
                    }
                    if (key === 'down') {
                        map.panBy([0, -80]);
                    }
                    if (key === '=') {
                        map.setZoom(map.getZoom() + 1);
                    }
                    if (key === '-') {
                        map.setZoom(map.getZoom() - 1);
                    }
                }}
            />
        }

        return (
            <div
                style={{height: '100%', flex: 1}}
            >
                <MapContainer
                    crs={CRS.Simple}
                    zoom={zoom}
                    minZoom={-50}
                    maxZoom={maxZoom}
                    center={[height / 2, width / 2]}
                    zoomAnimation={false}
                    zoomSnap={0.1}
                    zoomControl={false}
                    keyboard={true}
                    onZoom={(e:any) => this.setState({ zoom: e.target.getZoom() })}
                    onMousemove={(e:any) => this.setState({ cursorPos: e.latlng })}
                    ref = {this.mapRef}
                    style={{height: '100%', cursor: (label.name!==null ? 'crosshair' : 'grab')}}
                >
                    <ZoomControl position="bottomright"/>
                    <ImageOverlay url={url} bounds={bounds}/>
                    <MapHotKeys/>
                </MapContainer>
            </div>
        )
    }
}

export default withBounds(Canvas)