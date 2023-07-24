import Axios from "axios"
const AxiosAjustes =async () => {
    const jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAxNzI3NDcsImV4cCI6MTY5MDI1OTE0N30.LYt5cNwvhbfwh15Zt1WiL1pXQqCsYqCjuAQBSY5llGQ'
    const urlAjustes = 'https://inventarioproductos.onrender.com/ajustes'
    const response =await Axios({url:`${urlAjustes}`, headers:{'Authorization':`${jwToken}`}})
    return (await response).data
}
export default AxiosAjustes;
