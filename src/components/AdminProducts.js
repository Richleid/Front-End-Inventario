import React, { useEffect, useState } from 'react';
import ImgProd from '../assets/img/Switch_productos_nuevo.webp';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';
import { app } from '../fb';

const AdminProducts = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [producto, setProductos] = useState([]);
    const [categoria, setCategorias] = useState([]);
    const [pro_id, set_proId] = useState('');
    const [pro_nombre, setproNombre] = useState('');
    const [pro_descripcion, setproDescripcion] = useState('');
    const [cat_id, setcatId] = useState('');
    const [pro_valor_iva, setproValorIva] = useState('');
    const [pro_costo, setproCosto] = useState('');
    const [pro_pvp, setproPvp] = useState('');
    const [pro_imagen, setproImagen] = useState('');
    const [pro_estado, setproEstado] = useState(true);
    const [pro_stock, setproStock] = useState('');
    const [operation, setoperation] = useState(1);
    const [title, setTittle] = useState('');

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [docus, setDocus] = useState([]);

    useEffect(() => {
        getProductos();
        subida();
    }, []);

    const getProductos = async () => {
        try {
            const productos = await AxiosProducto('/productos', null, 'get');
            setProductos(productos);
            console.log(productos);
        } catch (error) {
            console.error('Error fetching products', error);
            // Luego puedes usar show_alerta(error.message) para mostrar el error al usuario si deseas
        }
    };

    const openModal = (op, pro_id, pro_nombre, pro_descripcion, cat_id, pro_valor_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) => {
        set_proId('');
        setproNombre('');
        setproDescripcion('');
        setcatId('');
        setproValorIva('');
        setproCosto('');
        setproPvp('');
        setproImagen('');
        setproEstado(true);
        setoperation(op);
        setModalOpen(true);
        if (op === 1) {
            setTittle('Registrar producto');
        } else if (op === 2) {
            setTittle('Actualizar producto');
            set_proId(pro_id);
            setproNombre(pro_nombre);
            setproDescripcion(pro_descripcion);
            setcatId(cat_id);
            setproValorIva(pro_valor_iva);
            setproCosto(pro_costo);
            setproPvp(pro_pvp);
            setproImagen(pro_imagen);
            setproEstado(true);
        }
        window.setTimeout(function () {
            document.getElementById('pro_nombre').focus();
        }, 500);
    };

    const closeModal = () => {
        setModalOpen(false);
        getProductos();
    };

    const validar = () => {
        var parametros;
        var metodo;
        var urlOperacion;
        if (pro_nombre.trim() === '') {
            show_alerta('Escribe el nombre del producto', 'warning');
        } else if (pro_descripcion.trim() === '') {
            show_alerta('Escribe la descripción del producto', 'warning');
        } else if (cat_id === '') {
            show_alerta('Elige la categoría del producto', 'warning');
        } else if (pro_valor_iva === '') {
            show_alerta('Escribe el valor de IVA', 'warning');
        } else if (pro_costo === '') {
            show_alerta('Escribe el costo del producto', 'warning');
        } else if (pro_pvp === '') {
            show_alerta('Escribe el pvp del producto', 'warning');
        } else if (pro_imagen.trim() === '') {
            show_alerta('Añade una imagen al producto', 'warning');
        } else {
            parametros = {
                pro_nombre: pro_nombre,
                pro_descripcion: pro_descripcion,
                cat_id: cat_id,
                pro_valor_iva: pro_valor_iva,
                pro_costo: pro_costo,
                pro_pvp: pro_pvp,
                pro_imagen: pro_imagen,
                pro_estado: pro_estado
            };
            if (operation === 1) {
                metodo = 'post';
                urlOperacion = '/productos/nuevo';
            } else {
                actualizarProducto();
            }
            enviarSolicitud(metodo, urlOperacion, parametros);
        }
    };

    const enviarSolicitud = async (metodo, urlOperacion, parametros) => {
        try {
            const respuesta = await AxiosProducto(urlOperacion, null, metodo, parametros);
            if (respuesta != null) {
                show_alerta('Guardado'); // Mostrar mensaje "Guardado"
                closeModal(); // Cerrar modal y recargar productos
            } else {
                show_alerta('Error en la respuesta del servidor', 'error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    /*const eliminarProducto = async (pro_id) => {
        try {
            const parametros = { pro_id };
            const respuesta = await AxiosProducto('/productos/delete', null, 'put', parametros);
            if (respuesta != null) {
                show_alerta('Eliminado'); // Mostrar mensaje "Eliminado"
                getProductos(); // Recargar productos
            } else {
                show_alerta('Error en la respuesta del servidor', 'error');
            }
        } catch (error) {
            show_alerta('Error en la solicitud: ' + error.message, 'error');
            console.log(error);
        }
    };*/

    const actualizarProducto = async () => {
        try {
            const parametros = {
                pro_id: pro_id,
                pro_nombre: pro_nombre,
                pro_descripcion: pro_descripcion,
                cat_id: cat_id,
                pro_valor_iva: pro_valor_iva,
                pro_costo: pro_costo,
                pro_pvp: pro_pvp,
                pro_imagen: pro_imagen,
                pro_estado: pro_estado
            };
            const metodo = 'put';
            const urlOperacion = '/ActualizarProducto';
            enviarSolicitud(metodo, urlOperacion, parametros);
        } catch (error) {
            console.log(error);
            // Maneja el error según tus necesidades
        }
    };


    const archivoHandler = async (e) => {
        const archivo = e.target.files[0];
        const storageRef = app.storage().ref();
        const archivoPath = storageRef.child(archivo.name);
        await archivoPath.put(archivo);
        console.log("Archivo cargado: " + archivo.name);
        const enlaceUrl = await archivoPath.getDownloadURL();
        setproImagen(enlaceUrl);
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const nombreArchivo = e.target.nombre.value;
        const coleccionRef = app.firestore().collection("archivosInventario");
        const docu = await coleccionRef.doc(nombreArchivo).set({ nombre: nombreArchivo, url: pro_imagen });
        console.log("Archivo cargado exitosamente: ", nombreArchivo, "url:", pro_imagen);
    }

    const subida = async () => {
        const docusList = await app.firestore().collection("archivosInventario").get();
        setDocus(docusList.docs.map((doc) => doc.data()));
    }

    return (
        <div className="App">
            <div className="mx-auto px-3">
                <div className="flex mt-4">
                    <div className="w-1/2 ">
                        <div className="flex justify-between">
                            <input type="text" placeholder="Buscar producto..." className="p-2 border-2 border-gray-200 rounded-md w-1/2" />
                            <button onClick={() => openModal(1)} className="bg-dark-purple text-white p-3 rounded">
                                <i className="fa-solid fa-circle-plus"></i>Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/1 p-3">
                    <table className="border-collapse divide-y divide-x divide-gray-500 text-center">
                        <thead className="bg-dark-purple  text-white">
                            <tr>
                                <th className="px-4 py-2 text-center text-sm">OPCIONES</th>
                                <th className="px-4 py-2 text-center text-sm">ID</th>
                                <th className="px-4 py-2 text-center text-sm">PRODUCTO</th>
                                <th className="px-4 py-2 text-center text-sm">DESCRIPCIÓN</th>
                                <th className="px-4 py-2 text-center text-sm">CATEGORÍA</th>
                                <th className="px-4 py-2 text-center text-sm">IVA</th>
                                <th className="px-4 py-2 text-center text-sm">COSTO</th>
                                <th className="px-4 py-2 text-center text-sm">PVP</th>
                                <th className="px-4 py-2 text-center text-sm">IMAGEN</th>
                                <th className="px-4 py-2 text-center text-sm">ESTADO</th>
                                <th className="px-4 py-2 text-center text-sm">STOCK</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-300">
                            {producto.map((productos, index) => {
                                const imagen = docus.find(
                                    (doc) =>
                                        doc.nombre === productos.pro_nombre &&
                                        doc.url === productos.pro_imagen
                                );

                                return (
                                    <tr
                                        key={productos.pro_id}
                                        className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                                    >
                                        <td className="flex justify-around space-x-4 items-center">
                                            <button
                                                onClick={() =>
                                                    openModal(
                                                        2,
                                                        productos.pro_id,
                                                        productos.pro_nombre,
                                                        productos.pro_descripcion,
                                                        productos.cat_id,
                                                        productos.pro_valor_iva,
                                                        productos.pro_costo,
                                                        productos.pro_pvp,
                                                        productos.pro_imagen,
                                                        productos.pro_estado
                                                    )
                                                }
                                                className="bg-dark-purple p-2 rounded-full"
                                                style={{ width: '37px', height: '40px' }}
                                            >
                                                <i className="fa-solid fa-edit text-white"></i>
                                            </button>
                                        </td>
                                        <td>{productos.pro_id}</td>
                                        <td>{productos.pro_nombre}</td>
                                        <td>{productos.pro_descripcion}</td>
                                        <td>{productos.cat_nombre}</td>
                                        <td>${new Intl.NumberFormat('en-US').format(productos.pro_valor_iva)}</td>
                                        <td>${new Intl.NumberFormat('en-US').format(productos.pro_costo)}</td>
                                        <td>${new Intl.NumberFormat('en-US').format(productos.pro_pvp)}</td>
                                        <td>
                                            {imagen ? (
                                                <img
                                                    src={imagen.url}
                                                    alt={productos.pro_nombre}
                                                    height="90px"
                                                    width="90px"
                                                    onClick={() => {
                                                        setSelectedImageUrl(imagen.url); // Aquí es donde se realizó el cambio.
                                                        setImageModalOpen(true);
                                                    }}
                                                />
                                            ) : (
                                                'Imagen no encontrada'
                                            )}
                                        </td>
                                        <td>{productos.pro_estado ? 'Inactivo' : 'Activo'}</td>
                                        <td>{productos.pro_stock}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {imageModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white relative rounded-lg">
                                <img src={selectedImageUrl} alt="Selected Product" height="500px" width="500px" />

                                <button
                                    type="button"
                                    id="btnCerrar"
                                    className="btn btn-secondary bg-dark-purple text-white p-3 rounded absolute top-2 right-2"
                                    onClick={() => {
                                        setImageModalOpen(false);
                                        setSelectedImageUrl("");
                                    }}
                                >
                                    <i className="fa-solid fa-window-close"></i> Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex mt-4 justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Previous</span>
                            {/* Heroicon name: solid/chevron-left */}
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {/* Example pagination links */}
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Next</span>
                            {/* Heroicon name: solid/chevron-right */}
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>

            {modalOpen && (
                <form onSubmit={submitHandler}>
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">

                        <div className="bg-white rounded-lg w-1/3">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <p className="text-lg font-bold">{title}</p>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="p-6">
                                <input type="hidden" id="id" />
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-navicon"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="pro_nombre"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Nombre"
                                        name='nombre'
                                        value={pro_nombre}
                                        onChange={(e) => setproNombre(e.target.value)}
                                    ></input>
                                </div>

                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-pencil"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="pro_descripcion"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Descripción"
                                        value={pro_descripcion}
                                        onChange={(e) => setproDescripcion(e.target.value)}
                                    ></input>
                                </div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-folder"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="cat_id"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Categoría"
                                        value={cat_id}
                                        onChange={(e) => setcatId(e.target.value)}
                                    ></input>
                                </div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-dollar"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="pro_valor_iva"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Valor Iva"
                                        value={pro_valor_iva}
                                        onChange={(e) => setproValorIva(e.target.value)}
                                    ></input>
                                </div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-dollar"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="pro_costo"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Costo"
                                        value={pro_costo}
                                        onChange={(e) => setproCosto(e.target.value)}
                                    ></input>
                                </div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-dollar"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="pro_pvp"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="PVP"
                                        value={pro_pvp}
                                        onChange={(e) => setproPvp(e.target.value)}
                                    ></input>
                                </div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-image"></i>
                                    </span>
                                    <input
                                        type="file"
                                        id="pro_imagen"
                                        className="border border-gray-200 rounded px-3 py-2 w-full hidden"
                                        onChange={archivoHandler}
                                    ></input>
                                    <label
                                        htmlFor="pro_imagen"
                                        className="cursor-pointer bg-dark-purple text-white rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-violet-600 focus:outline-none focus:shadow-outline"
                                    >
                                        <i className="fas fa-upload mr-2"></i>Subir archivo
                                    </label>
                                    {pro_imagen && (
                                        <div>
                                            <img src={pro_imagen} alt="Imagen anterior" height="300px" width="150px" />
                                        </div>
                                    )}
                                    <button className='cursor-pointer bg-dark-purple text-white rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-violet-600 focus:outline-none focus:shadow-outline'>Cargar Imagen</button>
                                </div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-lg">
                                        <i className="fa-solid fa-edit"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="pro_estado"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Estado"
                                        value={pro_estado}
                                        onChange={(e) => setproEstado(e.target.value)}
                                    ></input>
                                </div>
                                <div className="d-grid col-6 mx-auto flex justify-center">
                                    <button onClick={() => validar()} className="bg-dark-purple text-white p-3 rounded">
                                        <i className="fa-solid fa-floppy-disk"></i> Guardar
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            )}
        </div>
    );
}

export default AdminProducts;