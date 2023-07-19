import Axios from "axios"
const AxiosAjustes =async () => {
    const jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2ODk4MDQxNzUsImV4cCI6MTY4OTg5MDU3NX0.GIoVhggqOkcnz9MnFittgSkiFaSq7gunSV8h_Y88gqI'
    const urlAjustes = 'https://inventarioproductos.onrender.com/ajustes'
    const response =await Axios({url:`${urlAjustes}`, headers:{'Authorization':`${jwToken}`}})
    return (await response).data
}
export default AxiosAjustes;
