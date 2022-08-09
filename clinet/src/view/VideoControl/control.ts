import axios from 'axios'
import { MouseEventHandler } from 'react'
import { message } from 'antd'

export default function PTZControl(rtsp_addr: string, motion: string):MouseEventHandler<HTMLElement> {
    return () => {
        if(rtsp_addr === '') {
            message.warning('当前未选择摄像头')
            return
        }
        // split name and passwd
        const match = rtsp_addr.match(/(?<=(rtsp:\/\/)).*?(?=(@.*))/g)
        let username, passwd
        if( match !== null ) {
            username = match[0].split(':')[0]
            passwd = match[0].split(':')[1]
        } else {
            return 
        }
    
        axios.post('/api/ptz', { 
            username: username,
            passwd: passwd,
            motion: motion
        }).then((res)=>{
            console.log(res)
        },(rej)=>{
            console.log(rej)
        })
    }
}
