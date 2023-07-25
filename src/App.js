import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import UserContext from './UserContext';
import RoutPages from './routes/Routes';
import Login from './components/Login';
import imgSrc from './assets/img/imgMenu';
import AxiosProducto from './components/AxiosProducto';

function App() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Definimos las opciones del menú para cada rol
  const OptionsNavBar = {
    administrador: [
      { title: "Administracion de Ajustes", src: "Folder", href: "/AdminAjustes" },
      { title: "Administracion de Productos", src: "Chart_fill", href: "/AdminProduct" },
      { title: "Admnistración Categoria", src: "User", href: "/Categoria" },
      { title: "Kardex", src: "Folder", href: "/KardexProductos" },
      { title: "Productos Inactivos", src: "Chat", href: "/ProductosInactivos" },
      { title: "Actualizar ajuste", src: "Chat", href: "/AdminEditAjuste" },
    ],
    bodeguero: [
      { title: "Administracion de Ajustes", src: "Folder", href: "/AdminAjustes" },
    ],
    auditor: [
      { title: "Auditoria", src: "Folder", href: "/Auditoria" },
    ],
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole) {
      setUser(storedUser);
      setUserRole(storedRole);
    }
  }, []);


  const enviarSolicitud = async (metodo, urlOperacion, parametros) => {
    try {
      const respuesta = await AxiosProducto(urlOperacion, null, metodo, parametros);
      console.log(respuesta);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = (username, role) => {
    console.log('Usuario autenticado. Nombre:', username, 'Rol:', role);
    setUser(username);
    setUserRole(role);
    localStorage.setItem('user', username);
    localStorage.setItem('role', role);
    
    // Corregir la propiedad "aud_accion" y "aud_observacion"
    var parametros = {
      aud_usuario: username,
    };
    
    var metodo = 'post';
    var urlOperacion = '/Isesion';
    enviarSolicitud(metodo, urlOperacion, parametros);
  };
  


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/Login'; // Redirigimos al usuario a la página de inicio de sesión

     // Corregir la propiedad "aud_accion" y "aud_observacion"
     var parametros = {
      aud_usuario: user,
    };
    setUserRole(null); // Borramos la información del usuario
    var metodo = 'post';
    var urlOperacion = '/Csesion';
    enviarSolicitud(metodo, urlOperacion, parametros);
  };

  console.log('Estado actual de userRole:', userRole);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="flex">
          <div className={`${open ? "w-80" : "w-20"} duration-300 pl-2 h-screen gap-4 bg-dark-purple relative`}>
            <img src={imgSrc['control']} alt=''
              className={`${!open && "rotate-180"} absolute cursor-pointer rounded-full -right-3
       top-12 w-7 border-2 border-dark-purple`}
              onClick={() => setOpen(!open)}
            />
            <div className='flex gap-x-4 mt-4 items-center'>
              <img src={imgSrc['logo192']} alt='Logo-React'
                className='w-16 cursor-pointer duration-500'
              />
              <h1 className={`${!open && "hidden"}  text-white p-0 origin-left font-semibold text-x1 duration-200`}>
                Inventario Productos
              </h1>
            </div>
            <div className='flex gap-x-4 mt-4 items-center'>
              <h3 className={`${!open && "hidden"}  text-white p-0 origin-left font-semibold duration-200 text-base`}>
                {user}
              </h3>
            </div>
            <ul className={`${open ? "p-10 pt-5" : "p-0 pt-5"} duration-300`}>
              {userRole && OptionsNavBar[userRole].map((menu, index) => (
                <li key={index} className={`${menu.gap ? "mt-9" : "mt-2"} text-gray-300 text-sm flex items-center align-middle
        gap-x-4 cursor-pointer p-2 rounded-md mr-0 hover:bg-blue-500 duration-300`}>
                  <Link to={menu.href} className={`origin-left duration-300 flex items-center align-middle gap-x-4`}>
                    <img src={imgSrc[menu.src]} alt='' />
                    <h1 className={`${!open && 'hidden'}`}>{menu.title}</h1>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="absolute bottom-0 w-full mb-10 ml-2">
              {userRole !== null && (
                <div className='flex gap-x-4 items-center mt-10 cursor-pointer' onClick={handleLogout}>
                  <img src={imgSrc['Setting']} className={`w-6 ml-2`} alt='img-setting' />
                  <h1 className={`${!open && "scale-0 m-2"} text-white font-semibold origin-left textx1 duration-300`}>Cerrar Sesion</h1>
                </div>
              )}
            </div>
          </div>
          <div className={`font-semibold text-sm  relative flex justify-center w-full`}>
            {userRole === null ? (
              <Login setUserRole={handleLogin} />
            ) : (
              <div className={`w-full font-semibold text-xs sm:text-sm
              flex justify-center`}>
                <RoutPages />
              </div>
            )}
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
