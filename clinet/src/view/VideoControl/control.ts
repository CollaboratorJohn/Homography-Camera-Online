import axios from 'axios'
import { MouseEventHandler } from 'react'

export default function PTZControl(rstp_addr: string, motion: string):MouseEventHandler<HTMLElement> {
    return () => {
        // split name and passwd
        const match = rstp_addr.match(/(?<=(rtsp:\/\/)).*?(?=(@.*))/g)
        let username, passwd
        if( match !== null ) {
            username = match[0].split(':')[0]
            passwd = match[0].split(':')[1]
        } else {
            // throw 'Illegal user info'
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
