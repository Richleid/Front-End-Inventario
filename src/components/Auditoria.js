import React, { useEffect, useState, useContext } from 'react';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';
import UserContext from '../UserContext';
import { format } from 'date-fns';

const Auditoria = () => {
    const [auditoria, setAuditoria] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("");
    const { user } = useContext(UserContext);

    const columns = [
        { value: "", label: "Buscar en todas las columnas" },
        { value: "aud_id", label: "ID" },
        { value: "aud_usuario", label: "Usuario" },
        { value: "aud_fecha", label: "Fecha" },
        { value: "aud_accion", label: "Acción" },
        { value: "aud_modulo", label: "Módulo" },
        { value: "aud_funcionalidad", label: "Funcionalidad" },
        { value: "aud_observacion", label: "Observación" },
    ];

    const filteredAuditoria = auditoria.filter((auditorias) => {
        if (searchColumn === "") {
            const searchFields = [
                auditorias.aud_fecha.toLocaleString(),
                auditorias.aud_accion,
                auditorias.aud_modulo,
                auditorias.aud_funcionalidad,
                auditorias.aud_observacion,
                auditorias.aud_id.toString(),
                auditorias.aud_usuario,
            ];
            return searchFields.some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            const fieldValue = searchColumn === 'aud_fecha' ? auditorias[searchColumn].toLocaleString() : String(auditorias[searchColumn]);
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    const [currentPage, setCurrentPage] = useState(1);
    const auditoriasPerPage = 10;

    const indexOfLastAuditoria = currentPage * auditoriasPerPage;
    const indexOfFirstAuditoria = indexOfLastAuditoria - auditoriasPerPage;
    const currentAuditoria = filteredAuditoria.slice(
        indexOfFirstAuditoria,
        indexOfLastAuditoria
    );

    useEffect(() => {
        getAuditorias();
    }, []);

    const getAuditorias = async () => {
        try {
            const auditorias = await AxiosProducto('/auditoria', null, 'get');
            setAuditoria(auditorias);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSearchTerm(""); // Reiniciar el término de búsqueda al cambiar la columna
    };

    return (
        <div className="App">
            <div className="mx-auto px-3">
                <div className="flex mt-4">
                    <div className="w-1/2 ">
                        <div className="flex justify-between">
                            <select
                                value={searchColumn}
                                onChange={handleColumnChange}
                                className="p-2 border-2 border-gray-200 rounded-md"
                            >
                                {columns.map((column) => (
                                    <option key={column.value} value={column.value}>
                                        {column.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Buscar auditoría..."
                                className="p-2 border-2 border-gray-200 rounded-md w-1/2"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/1 p-3">
                    <table className="border-collapse divide-y divide-x divide-gray-500 text-center">
                        <thead className="bg-dark-purple  text-white">
                            <tr>
                                <th className="px-10 py-2 text-center text-sm">ID</th>
                                <th className="px-10 py-2 text-center text-sm">USUARIO</th>
                                <th className="px-10 py-2 text-center text-sm">FECHA Y HORA</th>
                                <th className="px-10 py-2 text-center text-sm">ACCIÓN</th>
                                <th className="px-10 py-2 text-center text-sm">MÓDULO</th>
                                <th className="px-10 py-2 text-center text-sm">FUNCIONALIDAD</th>
                                <th className="px-10 py-2 text-center text-sm">OBSERVACIÓN</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-300">
                            {currentAuditoria.map((auditorias, index) => {
                                return (
                                    <tr
                                        key={auditorias.aud_id}
                                        className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                                    >
                                        <td className="py-3">{auditorias.aud_id}</td>
                                        <td className="py-3">{auditorias.aud_usuario}</td>
                                        <td className="py-3">
                                            {/* Formatear la fecha utilizando date-fns */}
                                            {format(new Date(auditorias.aud_fecha), 'yyyy-MM-dd HH:mm:ss')}
                                        </td>
                                        <td className="py-3">{auditorias.aud_accion}</td>
                                        <td className="py-3">{auditorias.aud_modulo}</td>
                                        <td className="py-3">{auditorias.aud_funcionalidad}</td>
                                        <td className="py-3">{auditorias.aud_observacion}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="flex mt-4 justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Pagination buttons */}
                        {Array.from({ length: Math.ceil(auditoria.length / auditoriasPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                className={`relative inline-flex items-center px-4 py-2 border ${currentPage === index + 1 ? 'bg-dark-purple text-white' : 'border-gray-300 bg-white text-gray-700'
                                    } text-sm font-medium hover:bg-gray-50`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Auditoria;
