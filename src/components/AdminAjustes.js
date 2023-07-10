import React, { useEffect, useState } from 'react';
import ImgProd from '../assets/img/Switch_productos_nuevo.webp';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';

const AdminAjustes = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [ajustes, setAjustes] = useState([]);
    const [aju_numero, set_ajuId] = useState('');
    const [aju_fecha, setajuFecha] = useState('');
    const [aju_descripcion, setajuDescripcion] = useState('');
    const [aju_estado, setajuEstado] = useState(true);
    const [operation, setoperation] = useState(1);
    const [title, setTittle] = useState('');

    useEffect(() => {
        getAjustes();
    }, []);

    const getAjustes = async () => {
        try {
            const ajustes = await AxiosProducto('/ajustes', null, 'get');
            setAjustes(ajustes);
            console.log(ajustes);
        } catch (error) {
            console.error('Error fetching ajuts', error);
            // Luego puedes usar show_alerta(error.message) para mostrar el error al usuario si deseas
        }
    };

    const openModal = (op, aju_numero, aju_fecha, aju_descripcion, aju_estado) => {
        set_ajuId('');
        setajuFecha('');
        setajuDescripcion('');
        setajuEstado(true);
        setoperation(op);
        setModalOpen(true);
        if (op === 1) {
            setTittle('Registrar Ajuste');
        } else if (op === 2) {
            setTittle('Actualizar Ajuste');
            set_ajuId(aju_numero);
            setajuFecha(aju_fecha);
            setajuDescripcion(aju_descripcion);
            setajuEstado(aju_estado);
        }
        window.setTimeout(function () {
            document.getElementById('aju_numero').focus();
        }, 500);
    };

    const closeModal = () => {
        setModalOpen(false);
        getAjustes();
    };

    const validar = () => {
        var parametros;
        var metodo;
        var urlOperacion;
        if (aju_fecha.trim() === '') {
            show_alerta('Escribe la frcha del ajuste', 'warning');
        } else if (aju_descripcion.trim() === '') {
            show_alerta('Escribe la descripción del ajuste', 'warning');
        } else if (aju_estado === '') {
            show_alerta('Elige el estado del ajuste', 'warning');
        } else {
            parametros = {
                aju_fecha: aju_fecha,
                aju_descripcion: aju_descripcion,
                aju_estado: aju_estado
            };
            if (operation === 1) {
                metodo = 'post';
                urlOperacion = '/ajustes/nuevo';
            } else {
                metodo = 'put';
                urlOperacion = '/updateProducto';
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
            show_alerta('Error en la solicitud: ' + error.message, 'error');
            console.log(error);
        }
    };

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
                                <th className="px-4 py-2 text-center text-sm">CODIGO</th>
                                <th className="px-4 py-2 text-center text-sm">FECHA</th>
                                <th className="px-4 py-2 text-center text-sm">DESCRIPCIÓN</th>
                                <th className="px-4 py-2 text-center text-sm">ESTADO</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y-2 divide-gray-300">
                            {ajustes.map((ajuste, index) => (
                                <tr key={ajuste.aju_numero} className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                                    <td>{ajuste.aju_numero}</td>
                                    <td>{ajuste.aju_fecha}</td>
                                    <td>{ajuste.aju_descripcion}</td>
                                    <td>{ajuste.aju_estado ? 'Inactivo' : 'Activo'}</td>
                                    <td className="flex justify-around space-x-4 items-center">
                                        <button
                                            onClick={() =>
                                                openModal(
                                                    2,
                                                    ajuste.aju_numero,
                                                    ajuste.aju_fecha,
                                                    ajuste.aju_descripcion,
                                                    ajuste.aju_estado
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
                                    id="aju_fecha"
                                    className="border border-gray-200 rounded px-3 py-2 w-full"
                                    placeholder="Fecha"
                                    value={aju_fecha}
                                    onChange={(e) => setajuFecha(e.target.value)}
                                ></input>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-lg">
                                    <i className="fa-solid fa-pencil"></i>
                                </span>
                                <input
                                    type="text"
                                    id="aju_descripcion"
                                    className="border border-gray-200 rounded px-3 py-2 w-full"
                                    placeholder="Descripción"
                                    value={aju_descripcion}
                                    onChange={(e) => setajuDescripcion(e.target.value)}
                                ></input>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-lg">
                                    <i className="fa-solid fa-edit"></i>
                                </span>
                                <input
                                    type="text"
                                    id="aju_estado"
                                    className="border border-gray-200 rounded px-3 py-2 w-full"
                                    placeholder="Estado"
                                    value={aju_estado}
                                    onChange={(e) => setajuEstado(e.target.value)}
                                ></input>
                            </div>
                            <div className="d-grid col-6 mx-auto flex justify-center">
                                <button onClick={() => validar()} className="bg-dark-purple text-white p-3 rounded">
                                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
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

export default AdminAjustes;