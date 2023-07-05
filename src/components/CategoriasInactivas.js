import React, { useEffect, useState } from 'react';
import ImgProd from '../assets/img/Switch_productos_nuevo.webp';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';

const CategoriasInactivas = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [categoria, setCategorias] = useState([]);
    const [cat_id, setcatId] = useState('');
    const [cat_nombre, setcatNombre] = useState('');
    const [cat_estado, setcatEstado] = useState('');
    const [operation, setoperation] = useState(1);
    const [title, setTittle] = useState('');

    useEffect(() => {
        getCategoriasInactivas();
    }, []);

    const getCategoriasInactivas = async () => {
        try {
            const categorias = await AxiosProducto('/categoriasD', null, 'get');
            setCategorias(categorias);
            console.log(categorias);
        } catch (error) {
            console.error('Error fetching products', error);
            // Luego puedes usar show_alerta(error.message) para mostrar el error al usuario si deseas
        }
    };

    const openModal = (op, cat_id, cat_nombre, cat_estado) => {
        setcatId('');
        setcatNombre('');
        setcatEstado(true);
        setoperation(op);
        setModalOpen(true);
        if (op === 1) {
            setTittle('Registrar Categoría');
        } else if (op === 2) {
            setTittle('Actualizar Categoría');
            setcatId(cat_id);
            setcatNombre(cat_nombre);
            setcatEstado(cat_estado);
        }
        window.setTimeout(function () {
            document.getElementById('cat_nombre').focus();
        }, 500);
    };

    const closeModal = () => {
        setModalOpen(false);
        getCategoriasInactivas();
    };

    const actualizarCategoria = async () => {
        try {
            // Resto de la lógica para obtener los datos actualizados del producto
            const parametros = {
                cat_id: cat_id,
                cat_nombre: cat_nombre,
                cat_estado: cat_estado
            };
            const metodo = 'put';
            const urlOperacion = '/updateCategoria/' + cat_id;
            enviarSolicitud(metodo, urlOperacion, parametros);
        } catch (error) {
            console.log(error);
            // Maneja el error según tus necesidades
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


    return (
        <div className="App pt-48">
            <div className="mx-auto px-3">
                <div className="lg:w-1/1 p-3 ">
                    <div className="w-1/2 ">
                        <div className="flex justify-between">
                            <input type="text" placeholder="Buscar producto..." className="p-2 border-2 border-gray-200 rounded-md w-1/2" />
                        </div>
                    </div>
                    <table className="border-collapse divide-y divide-x divide-gray-500 text-center ">
                        <thead className="bg-dark-purple  text-white">
                            <tr>
                                <th className="px-6 py-2 text-center text-sm">ID</th>
                                <th className="px-6 py-2 text-center text-sm">CATEGORÍA</th>
                                <th className="px-6 py-2 text-center text-sm">ESTADO</th>
                                <th className="px-6 py-2 text-center text-sm">OPCIONES</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y-2 divide-gray-300">
                            {categoria.map((categorias, index) => (
                                <tr key={categorias.cat_id} className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                                    <td>{categorias.cat_id}</td>
                                    <td>{categorias.cat_nombre}</td>
                                    <td>{categorias.cat_estado ? 'Inactivo' : 'Activo'}</td>
                                    <td className="flex justify-around space-x-4 items-center">
                                        <button
                                            onClick={() =>
                                                openModal(
                                                    2,
                                                    categorias.cat_id,
                                                    categorias.cat_nombre,
                                                    categorias.cat_estado
                                                )
                                            }
                                            className="bg-dark-purple p-2 rounded-full"
                                            style={{ width: '37px', height: '40px' }}
                                        >
                                            <i className="fa-solid fa-edit text-white"></i>
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                    id="cat_nombre"
                                    className="border border-gray-200 rounded px-3 py-2 w-full"
                                    placeholder="Nombre"
                                    value={cat_nombre}
                                    onChange={(e) => setcatNombre(e.target.value)}
                                ></input>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-lg">
                                    <i className="fa-solid fa-edit"></i>
                                </span>
                                <input
                                    type="text"
                                    id="cat_estado"
                                    className="border border-gray-200 rounded px-3 py-2 w-full"
                                    placeholder="Estado"
                                    value={cat_estado}
                                    onChange={(e) => setcatEstado(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <div className="modal-footer flex justify-end">
                            <button type="button" id="btnCerrar" className="btn btn-secondary bg-dark-purple text-white p-3 rounded" onClick={closeModal}>
                                <i className="fa-solid fa-window-close"></i> Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoriasInactivas;