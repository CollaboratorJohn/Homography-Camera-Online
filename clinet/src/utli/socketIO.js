import io from 'socket.io-client'

const socket = io(`http://${window.location.host}/`, { path:'/assist' });

export default socket