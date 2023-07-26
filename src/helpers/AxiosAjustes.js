import Axios from "axios"
const AxiosAjustes =async () => {
    const jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAyOTc0NDEsImV4cCI6MTY5MDU1NjY0MX0.2NcAwMJ1Kp8zc56WsCFR3bYvS0oWUjpyt-BWkmKelaQ'
    const urlAjustes = 'https://inventarioproductos.onrender.com/ajustes'
    const response =await Axios({url:`${urlAjustes}`, headers:{'Authorization':`${jwToken}`}})
    return (await response).data
}
export default AxiosAjustes;
