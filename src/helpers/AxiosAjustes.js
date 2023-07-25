import Axios from "axios"
const AxiosAjustes =async () => {
    const jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAyNDM4ODksImV4cCI6MTY5MDUwMzA4OX0.QdMSJgSMt5YvcQG8cSjG74UnvHjHz_YOQINovEKtLAc'
    const urlAjustes = 'https://inventarioproductos.onrender.com/ajustes'
    const response =await Axios({url:`${urlAjustes}`, headers:{'Authorization':`${jwToken}`}})
    return (await response).data
}
export default AxiosAjustes;
