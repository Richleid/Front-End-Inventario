import Axios from 'axios';

const AxiosProducto = async (url, condiciones = null, tipoPeticion, parametros = null) => {
  const jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2ODg5NjMwMzksImV4cCI6MTY4OTA0OTQzOX0.8mgoBq4GV9Zh5r8YS7rez1P7RFPxjXfOiSUtD9RAaJc';
  const baseUrl = 'https://inventarioproductos.onrender.com';
  let peticion;

  Axios.defaults.headers.common['Authorization'] = `${jwToken}`;
  Axios.defaults.headers.common['Content-Type'] = 'application/json';

  try {
    let urlPeticion = baseUrl + url;
    if (condiciones) {
      urlPeticion += `/${condiciones}`;
    }

    if (tipoPeticion === 'get') {
      peticion = await Axios.get(urlPeticion);
    } else if (tipoPeticion === 'post') {
      peticion = await Axios.post(urlPeticion, parametros);
    } else if (tipoPeticion === 'put') {
      peticion = await Axios.put(urlPeticion, parametros);
    }

  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return peticion.data;
};

export default AxiosProducto;
