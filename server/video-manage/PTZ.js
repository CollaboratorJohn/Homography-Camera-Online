const http = require('http');
const md5 = require('md5-node');
const router = require('express').Router();
// const bodyParser = require('body-parser');

// manage ptz of camera
function sleep() {
    const time = Date.now()
    while(Date.now() - time < 100) {
        continue
    }
}

async function PTZControl(username, passwd, motion) {
    let options
    let req
    // send move order
    // try {
        options = await requestNonce(username, passwd, motion)
        req = http.request(options.options, res => {
            res.on('data', (_res) => {
                console.log(_res.toString())
            });
            res.on('end', async () => {
                sleep()
                Promise.resolve({PTZControl: 'success'})
                await PTZStop(username, passwd, motion)
            });
        }).on('error',e => {
            Promise.reject({PTZControl: e})
        });
        req.write(options.content);
        req.end(); 
        
    // } catch(e) {
    //     Promise.reject({PTZControl: e})
    // }
}

async function PTZStop(username, passwd, motion) {
    let options
    let req
    // send stop order
    // try {
        if(motion.indexOf('IRIS') !== -1)
            options = await requestNonce(username, passwd, 'IRIS STOP')
        else if(motion.indexOf('FOCUS') !== -1)
            options = await requestNonce(username, passwd, 'FOCUS STOP')
        else if(motion.indexOf('ZOOM') !== -1)
            options = await requestNonce(username, passwd, 'ZOOM STOP')
        else
            options = await requestNonce(username, passwd, 'MOVE STOP')

        req = http.request(options.options, res => {
            res.on('data', (_res) => {
                // log state
                console.log(_res.toString())
            });
            res.on('end', () => {
                Promise.resolve({PTZControl: 'success'})
            });
        }).on('error',e => {
            Promise.reject({PTZControl: e})
        });
        req.write(options.content);
        req.end();
    // } catch(e) {
    //     Promise.reject({PTZControl: e})
    // }
}

async function requestNonce(username, passwd, motion) {
    return new Promise((resolve,reject) => {
        let uri = ''
        let content = ''
        switch (motion) {
            case 'MOVE STOP':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>0</pan><tilt>0</tilt></PTZData>'
                break
            case '1':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>-60</pan><tilt>-60</tilt></PTZData>'
                break
            case '2':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>0</pan><tilt>-60</tilt></PTZData>'
                break
            case '3':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>60</pan><tilt>-60</tilt></PTZData>'
                break
            case '4':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>-60</pan><tilt>0</tilt></PTZData>'
                break
            case '6':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>60</pan><tilt>0</tilt></PTZData>'
                break
            case '7':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>-60</pan><tilt>60</tilt></PTZData>'
                break
            case '8':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>0</pan><tilt>60</tilt></PTZData>'
                break
            case '9':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><pan>60</pan><tilt>60</tilt></PTZData>'
                break
            
            case 'ZOOM+':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><zoom>60</zoom></PTZData>'
                break
            case 'ZOOM-':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><zoom>-60</zoom></PTZData>'
                break
            case 'ZOOM STOP':
                uri = '/ISAPI/PTZCtrl/channels/1/continuous'
                content = '<?xml version: "1.0" encoding="UTF-8"?><PTZData><zoom>0</zoom></PTZData>'
                break

            case 'FOCUS+':
                uri = '/ISAPI/System/Video/inputs/channels/1/focus'
                content = '<?xml version: "1.0" encoding="UTF-8"?><FocusData><focus>60</focus></FocusData>'
                break
            case 'FOCUS-':
                uri = '/ISAPI/System/Video/inputs/channels/1/focus'
                content = '<?xml version: "1.0" encoding="UTF-8"?><FocusData><focus>-60</focus></FocusData>'
                break
            case 'FOCUS STOP':
                uri = '/ISAPI/System/Video/inputs/channels/1/focus'
                content = '<?xml version: "1.0" encoding="UTF-8"?><FocusData><focus>0</focus></FocusData>'
                break

            case 'IRIS+':
                uri = '/ISAPI/System/Video/inputs/channels/1/iris'
                content = '<?xml version: "1.0" encoding="UTF-8"?><IrisData><iris>60</iris></IrisData>'
                break
            case 'IRIS-':
                uri = '/ISAPI/System/Video/inputs/channels/1/iris'
                content = '<?xml version: "1.0" encoding="UTF-8"?><IrisData><iris>-60</iris></IrisData>'
                break
            case 'IRIS STOP':
                uri = '/ISAPI/System/Video/inputs/channels/1/iris'
                content = '<?xml version: "1.0" encoding="UTF-8"?><IrisData><iris>0</iris></IrisData>'
                break
                
            default:
                break
        }
            
        http.get("http://3.1.200.196/ISAPI/PTZCtrl/channels/1/continuous", gres => {
        gres.on('data', () => {})
        gres.on('end', () => {
            const nonce = gres.headers['www-authenticate'].match(/\snonce="([^"]+)/)[1]
            const a1Hash = md5(`${username}:IP Camera(E8131):${passwd}`)
            const a2Hash = md5(`PUT:${uri}`)
            const nc = '00000001'
            const cnonce = '00b090339f294b5c'
            const response = md5(`${a1Hash}:${nonce}:${nc}:${cnonce}:auth:${a2Hash}`)

            let auth = `Digest username="${username}", \
                realm="IP Camera(E8131)", \
                nonce="${nonce}", \
                uri="${uri}", \
                algorithm=MD5, \
                response="${response}", \
                opaque="5ccc069c403ebaf9f0171e9517f40e41", \
                qop=auth, \
                nc=${nc}, \
                cnonce="${cnonce}"`

            let options = {
                host: '3.1.200.196', //请求服务器地址
                port: 80,
                path: uri,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/xml',
                    'Content-Length': content.length,
                    'Authorization': auth
                }
            }
            resolve({options:options, content: content})
        })
    }).on('error', e => {
        reject({PTZControl: e})
    })    
    })
}

function initPTZControlCallback(app) {
    // app.use(bodyParser.json())
    app.post('/api/ptz',async (req, res) => {
        const username = req.body.username
        const passwd = req.body.passwd
        const motion = req.body.motion
        console.log(username)
        PTZControl(username, passwd, motion).then((_res) => {
            res.json(_res)
        },(_rej) => {
            res.json(_rej)
        })

    })
}

module.exports = { initPTZControlCallback }