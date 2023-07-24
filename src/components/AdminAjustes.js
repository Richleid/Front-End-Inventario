import React, { useEffect, useState, useContext } from "react";
import ImgProd from "../assets/img/Switch_productos_nuevo.webp";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../functions";
import AxiosProducto from "../components/AxiosProducto";
import axios from "axios";
import UserContext from '../UserContext';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom'
import AdminAjuste from "./AdminAjuste";


const AdminAjustes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ajustes, setAjustes] = useState([]);
  const [aju_numero, set_ajuId] = useState("");
  const [aju_fecha, setajuFecha] = useState("");
  const [aju_descripcion, setajuDescripcion] = useState("");
  const [aju_estado, setajuEstado] = useState(true);
  const [operation, setoperation] = useState(1);
  const [title, setTittle] = useState("");
  const { user } = useContext(UserContext);

  const [proId, setProId] = useState("");
  const [ajuDetCantidad, setAjuDetCantidad] = useState("");
  const [ajuDetModificable, setAjuDetModificable] = useState(true);
  const [ajuEstadoDetalle, setAjuEstadoDetalle] = useState(true);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [opcion, setOpcion] = useState("Abastecimiento"); // Nuevo estado para la opción seleccionada

  //Búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  const columns = [
    { value: "", label: "Buscar en todas las columnas" },
    { value: "aju_numero", label: "Codigo de Ajuste" },
    { value: "aju_fecha", label: "Fecha de Ajuste" },
    { value: "aju_descripcion", label: "Descripción" },
  ];

  const filteredAjustes = ajustes.filter((ajuste) => {
    if (searchColumn === "") {
      // Buscar en todas las columnas
      const searchFields = [
        ajuste.aju_numero.toString(),
        ajuste.aju_fecha,
        ajuste.aju_descripcion,
      ];
      return searchFields.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchColumn === "aju_numero") {
      // Buscar en el campo pro_id
      const fieldValue = ajuste.aju_numero.toString();
      return fieldValue.includes(searchTerm);
    } else {
      // Buscar en una columna específica
      const fieldValue = ajuste[searchColumn];
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const ajustesPerPage = 10;

  const indexOfLastAjuste = currentPage * ajustesPerPage;
  const indexOfFirstAjuste = indexOfLastAjuste - ajustesPerPage;
  const currentAjustes = filteredAjustes.slice(
    indexOfFirstAjuste,
    indexOfLastAjuste
  );

  const eliminarDetalle = (index) => {
    setDetalles(detalles.filter((detalle, i) => i !== index));
  };

  const agregarDetalle = () => {
    console.log("Agregando detalle"); // Para verificar que la función se está llamando
    console.log(proId, ajuDetCantidad, ajuDetModificable, ajuEstadoDetalle); // Para verificar los valores

    const existingProduct = detalles.find(
      (detalle) => detalle.pro_id === proId
    );
    if (existingProduct) {
      alert(
        "Este producto ya ha sido agregado. Por favor, elíjalo de la lista y elimínelo antes de agregarlo de nuevo."
      );
      return;
    }

    const cantidadFinal =
      opcion === "Retiro"
        ? -Math.abs(ajuDetCantidad)
        : Math.abs(ajuDetCantidad);

    setDetalles((detalles) => [
      ...detalles,
      {
        aud_usuario:user,
        pro_id: proId,
        aju_det_cantidad: cantidadFinal,
        aju_det_modificable: ajuDetModificable,
        aju_det_estado: ajuEstadoDetalle,
      },
    ]);

    setProId("");
    setAjuDetCantidad("");
    setAjuDetModificable(true);
    setAjuEstadoDetalle(true);
  };
  const getProductos = async () => {
    try {
      const productos = await AxiosProducto('/productos', null, 'get');
      setProductos(productos);
      console.log(productos);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };
  const handleSubmit = async (event) => {
    try {
      const responseAjuste = await axios.post(
        "https://inventarioproductos.onrender.com/ajustes/nuevo",
        {
          aud_usuario:user,
          aju_fecha: aju_fecha,
          aju_descripcion: aju_descripcion,
          aju_estado: aju_estado,
        },
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAxNzI3NDcsImV4cCI6MTY5MDI1OTE0N30.LYt5cNwvhbfwh15Zt1WiL1pXQqCsYqCjuAQBSY5llGQ",
          },
        }
      );

      if (
        responseAjuste &&
        responseAjuste.data &&
        responseAjuste.data.response
      ) {
        const ajuNumeroGenerado = responseAjuste.data.response.aju_numero;
        console.log(ajuNumeroGenerado);

        for (const detalle of detalles) {
          console.log("Enviando detalle:", detalle); // Agrega este console.log para verificar

          console.log("Objeto a enviar:", {
            aju_numero: ajuNumeroGenerado,
            ...detalle,
          });

          await axios.post(
            "https://inventarioproductos.onrender.com/detalles/nuevo",
            {
              aju_numero: ajuNumeroGenerado,
              ...detalle,
            },
            {
              headers: {
                Authorization:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAxNzI3NDcsImV4cCI6MTY5MDI1OTE0N30.LYt5cNwvhbfwh15Zt1WiL1pXQqCsYqCjuAQBSY5llGQ",
              },
            }
          );
        }

        setajuFecha("");
        setajuDescripcion("");
        setajuEstado(true);
        setDetalles([]);
      } else {
        console.log("Error en la respuesta de la petición de ajuste");
      }
    } catch (error) {
      console.log(error.response.data.Mensaje);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleColumnChange = (e) => {
    setSearchColumn(e.target.value);
    setSearchTerm(""); // Reiniciar el término de búsqueda al cambiar la columna
  };
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          "https://inventarioproductos.onrender.com/productos",
          {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAxNzI3NDcsImV4cCI6MTY5MDI1OTE0N30.LYt5cNwvhbfwh15Zt1WiL1pXQqCsYqCjuAQBSY5llGQ",
            },
          }
        );
        setProductos(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    getAjustes();
  }, []);

  const getAjustes = async () => {
    try {
      getProductos();
      const ajustes = await AxiosProducto("/ajustes", null, "get");
      setAjustes(ajustes);
      console.log(ajustes);
    } catch (error) {
      console.error("Error fetching products", error);
      // Luego puedes usar show_alerta(error.message) para mostrar el error al usuario si deseas
    }
  };

  const openModal = (
    op,
    aju_numero,
    aju_fecha,
    aju_descripcion,
    aju_estado,
    proId,
    ajuDetCantidad,
    ajuDetModificable,
    ajuEstadoDetalle,
    productos,
    detalles
  ) => {
    set_ajuId("");
    setajuFecha("");
    setajuDescripcion("");
    setajuEstado(true);
    setoperation(op);
    setModalOpen(true);
    setProId("");
    setAjuDetCantidad("");
    setAjuDetModificable(true);
    setAjuEstadoDetalle(true);
    setProductos([]);
    setDetalles([]);
    if (op === 1) {
      setTittle("Registrar Ajuste");
    } else if (op === 2) {
      setTittle("Actualizar Ajuste");
      set_ajuId(aju_numero);
      setajuFecha(aju_fecha);
      setajuDescripcion(aju_descripcion);
      setajuEstado(aju_estado);
      setAjuDetCantidad(ajuDetCantidad);
    }
    window.setTimeout(function () {
      document.getElementById("aju_fecha").focus();
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
    if (aju_fecha.trim() === "") {
      show_alerta("Escribe la frcha del ajuste", "warning");
    } else if (aju_descripcion.trim() === "") {
      show_alerta("Escribe la descripción del ajuste", "warning");
    } else if (aju_estado === "") {
      show_alerta("Elige el estado del ajuste", "warning");
    } else {
      parametros = {
        aud_usuario:user,
        aju_fecha: aju_fecha,
        aju_descripcion: aju_descripcion,
        aju_estado: aju_estado,
      };
      if (operation === 1) {
        metodo = "get";
        urlOperacion = "/ajustes";
        handleSubmit();
      } else {
        metodo = "put";
        urlOperacion = "/updateProducto";
      }
      enviarSolicitud(metodo, urlOperacion, parametros);
    }
  };

  const enviarSolicitud = async (metodo, urlOperacion, parametros) => {
    try {
      const respuesta = await AxiosProducto(
        urlOperacion,
        null,
        metodo,
        parametros
      );
      if (respuesta != null) {
        show_alerta("Guardado"); // Mostrar mensaje "Guardado"
        closeModal(); // Cerrar modal y recargar productos
      } else {
        show_alerta("Error en la respuesta del servidor", "error");
      }
    } catch (error) {
      show_alerta("Error en la solicitud: " + error.message, "error");
      console.log(error);
    }
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
                className="p-2 border-2 border-gray-200 rounded-md">
                {columns.map((column) => (
                  <option key={column.value} value={column.value}>
                    {column.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Buscar ajuste..."
                className="p-2 border-2 border-gray-200 rounded-md w-1/2"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button onClick={() => openModal(1)} className="bg-dark-purple text-white p-3 rounded">
                <i className="fa-solid fa-circle-plus"></i>Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="lg:w-full p-3">
          <div className="overflow-x-auto"></div>
          <table className="border-collapse divide-y divide-x divide-gray-500 text-center">
            <thead className="bg-dark-purple  text-white">
              <tr>
                <th className="px-20 py-2 text-center text-sm">OPCIONES</th>
                <th className="px-20 py-2 text-center text-sm">CODIGO</th>
                <th className="px-20 py-2 text-center text-sm">FECHA</th>
                <th className="px-20 py-2 text-center text-sm">DESCRIPCIÓN</th>
                <th className="px-20 py-2 text-center text-sm">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-300">
              {currentAjustes.map((ajuste, index) => (
                <tr
                  key={ajuste.aju_numero}
                  className={`bg-white ${index % 2 === 0 ? "bg-gray-50" : ""
                    } hover:bg-gray-100`}
                >
                  <td style={{ verticalAlign: 'middle' }}>
                  <Link to={'/AdminEditAjuste'} className="bg-dark-purple p-2 rounded-full">
                      <i className="fa-solid fa-edit text-white"></i>
                    </Link>
                    <Routes>
                      <Route path="/AdminEditAjuste" element={<AdminAjuste />}>
                      </Route>
                    </Routes>
                  </td>
                  <td className="p-3">{ajuste.aju_numero}</td>
                  <td>{ajuste.aju_fecha}</td>
                  <td>{ajuste.aju_descripcion}</td>
                  <td>{ajuste.aju_estado ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex mt-4 justify-center">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Previous</span>
              {/* Heroicon name: solid/chevron-left */}
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Example pagination links */}
            {Array.from({ length: Math.ceil(ajustes.length / ajustesPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`relative inline-flex items-center px-4 py-2 border ${currentPage === index + 1 ? 'bg-dark-purple text-white' : 'border-gray-300 bg-white text-gray-700'
                  } text-sm font-medium hover:bg-gray-50`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Next</span>
              {/* Heroicon name: solid/chevron-right */}
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
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
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6">
              <input type="hidden" id="id" />
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <i className="fa fa-calendar-check" aria-hidden="true"></i>
                  <label className="text-sm">Fecha</label>
                </div>
                <input
                  type="date"
                  id="aju_fecha"
                  className="border border-gray-200 rounded px-3 py-2"
                  placeholder="Fecha"
                  value={aju_fecha}
                  onChange={(e) => setajuFecha(e.target.value)}
                ></input>
                <div className="flex items-center space-x-2">
                  <i className="fa fa-pencil"></i>
                  <label className="text-sm">Descripción</label>
                </div>
                <input
                  type="text"
                  id="aju_descripcion"
                  className="border border-gray-200 rounded px-3 py-2"
                  placeholder="Descripción"
                  value={aju_descripcion}
                  onChange={(e) => setajuDescripcion(e.target.value)}
                ></input>
                <div className="flex items-center space-x-2">
                  <i className="fa fa-check-square"></i>
                  <label className="text-sm">Estado</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="aju_estado"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={aju_estado}
                    onChange={(e) => setajuEstado(e.target.checked)}
                  />
                  <p>{aju_estado ? "Activo" : "Inactivo"}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fa fa-tag"></i>
                  <label className="text-sm">Producto</label>
                </div>
                <select
                  value={proId}
                  onChange={(e) => setProId(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-2"
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.pro_id} value={producto.pro_id}>
                      {producto.pro_nombre}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-navicon"></i>
                  <label className="text-sm">Opción</label>
                </div>
                <select
                  value={opcion}
                  onChange={(e) => setOpcion(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-2"
                >
                  <option value="Abastecimiento">Abastecimiento</option>
                  <option value="Retiro">Retiro</option>
                </select>
                <div className="flex items-center space-x-2">
                  <i className="fa fa-calculator"></i>
                  <label className="text-sm">Cantidad</label>
                </div>
                <input
                  type="number"
                  id="ajuDetCantidad"
                  className="border border-gray-200 rounded px-3 py-2"
                  placeholder="Cantidad"
                  value={ajuDetCantidad}
                  min="0"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const numberValue = parseInt(inputValue);
                    if (!isNaN(numberValue)) {
                      setAjuDetCantidad(numberValue);
                    } else {
                      setAjuDetCantidad("");
                    }
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-center">
                  <button
                    onClick={agregarDetalle}
                    className="bg-dark-purple text-white p-2 rounded"
                    style={{ fontSize: '12px', padding: '8px 12px', marginBottom: '10px' }}
                  >
                    <i className="fa-solid fa-arrow-up-from-bracket"></i> Agregar Detalle
                  </button>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col gap-6 w-4/5 self-center border-black-500 border-4 rounded-xl">
                    {detalles.map((detalle, index) => (
                      <div key={index} className="detalle">
                        <p>
                          Producto:{" "}
                          {productos.find((p) => p.pro_id == detalle.pro_id)
                            ?.pro_nombre + " " || "Producto no encontrado"}
                          - Cantidad: {detalle.aju_det_cantidad}{" "}
                          <button
                            type="button"
                            onClick={() => eliminarDetalle(index)}
                            className="bg-dark-purple text-white p-1 rounded"
                          >
                            <i className="fa-solid fa-xmark"></i> Eliminar
                          </button>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => validar()}
                    className="bg-dark-purple text-white p-3 rounded"
                  >
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAjustes;