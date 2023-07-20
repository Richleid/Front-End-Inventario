import React, { useState } from 'react'
import PaginationButtons from './PaginationButtons'
import TableContent from './Table/TableContent'
import AxiosKardex from '../helpers/AxiosKardex'
import CardsContent from './Table/CardsContent'
import TableHeader from './Table/TableHeader'
import CircularWithValueLabel from '../helpers/CircularProgressWithLabel'
import { useEffect, useRef } from 'react'
import PDFButtonKardex from './PDFButtonKardex'

const KardexProductos = () => {
    const [respuestaDatos, setRespuestaDatos] = useState()
    const [respuestaDatosFiltrados, setRespuestaDatosFiltrados] = useState()
    const [filtroProducto, setFiltroProducto] = useState('1')
    const [datosProductoBuscado, setDatosProductoBuscado] = useState({
        codProd: '',
        nombreProd: ''
    })

    let [currentPage, setCurrentPage] = useState(0)
    let itemsPerPage = 0
    const cantElementos = 6
    const startIndex = currentPage * cantElementos
    const endIndex = startIndex + cantElementos
    let currentData = []
    const timerRef = useRef(null);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
    }

    useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setCurrentPage(0);
        }, 1000);
    }, [filtroProducto]);

    useEffect(() => {
        AxiosKardex().then((resp) => {
            setRespuestaDatos(resp)
        })
    }, [])

    const datosProductosFiltrados = () => {
        if (respuestaDatos) {
            let productos = respuestaDatos
            let datosFiltrados = productos.filter(function (datosFiltrados) {
                return datosFiltrados.idProducto === datosProductoBuscado.codProd
            })
            let tamanoDatos = datosFiltrados.length - 1
            if (tamanoDatos >= 0) {
                datosFiltrados[tamanoDatos].stock = datosFiltrados[tamanoDatos].cantidad
                for (let index = tamanoDatos - 1; index >= 0; index--) {
                    datosFiltrados[index].stock = parseInt(datosFiltrados[index + 1].stock) + parseInt(datosFiltrados[index].cantidad)
                }
            }
            setRespuestaDatosFiltrados(datosFiltrados)
        }
    }

    useEffect(() => {
        if (datosProductoBuscado) {
            datosProductosFiltrados()
        }
    }, [datosProductoBuscado])

    const buscarProductoByIdName = () => {
        if (respuestaDatos) {
            let productosSinFiltro = respuestaDatos;
            let productosConFiltro = productosSinFiltro.filter(function (productosConFiltro) {
                return productosConFiltro.idProducto === filtroProducto || productosConFiltro.nombreProducto.toLowerCase() === filtroProducto.toLowerCase()
            })
            if (productosConFiltro[0]) {
                setDatosProductoBuscado({
                    nombreProd: `${productosConFiltro[0].nombreProducto}`,
                    codProd: `${productosConFiltro[0].idProducto}`
                })
            } else {
                setDatosProductoBuscado({
                    nombreProd: ``,
                    codProd: ``
                })
            }
        }
    }

    useEffect(() => {
        buscarProductoByIdName()
    }, [filtroProducto])

    const handleSearchProducto = ({ target }) => {
        let idProducto = target.value
        setFiltroProducto(idProducto.trim())
    }

    if (!respuestaDatos) {
        return (
            <div className='flex flex-col justify-center align-middle'>
                <CircularWithValueLabel />
            </div>
        )
    } else {
        if (respuestaDatosFiltrados) {
            itemsPerPage = Math.ceil(respuestaDatosFiltrados.length / cantElementos)
            currentData = respuestaDatosFiltrados.slice(startIndex, endIndex)
        }
        return (
            <div className='bg-dark-purple w-5/6 mt-0 md:m-10 rounded-md'>
                <div className='flex justify-center mt-1 md:mt-8 text-cyan-50 text-2xl'>
                    Kardex de Productos
                </div>
                <div className='mt-3 mb-0 sm:pl-2 flex flex-col justify-center items-center'>
                    <input placeholder='Busqueda...' className=' m-1 border border-black rounded-md p-1 h-8' onChange={handleSearchProducto}></input>
                    <table className='border-2 mt-3 border-black bg-white'>
                        <tbody>
                            <tr>
                                <td className='border-2 border-black p-2 bg-dark-purple text-white'>Cod. Prod</td>
                                <td className='border-2 border-black p-2'>{datosProductoBuscado.codProd}</td>
                            </tr>
                            <tr>
                                <td className='border-2 border-black p-2 bg-dark-purple text-white'>Producto</td>
                                <td className='border-2 border-black p-2'>{datosProductoBuscado.nombreProd}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-col items-center'>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:hidden`}>
                        {currentData.map((valor) => (
                            valor.idProducto ? <CardsContent valor={valor} /> : `${console.log('vacio')}`
                        ))}
                        <div className='w-full mt-4 mb-5 h-1/2 col-span-1 sm:col-span-2'>
                            <PaginationButtons itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
                        </div>
                    </div>
                    <table className='m-1 mt-4 w-5/6 h-1/2 invisible absolute md:relative md:visible'>
                        <thead className='bg-blue-200 border border-solid'>
                            <TableHeader />
                        </thead>
                        <tbody className='bg-white border border-solid'>
                            {currentData.map((valor) => (
                                //valor.idProducto === filtroIdProducto && 
                                <TableContent valor={valor} />
                            ))}
                        </tbody>
                    </table>
                    <div className='w-full mt-4 h-1/2 invisible absolute md:relative md:visible'>
                        <PaginationButtons itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
                    </div>
                    <div>
                        <PDFButtonKardex datosProductoBuscado={datosProductoBuscado} currentData={currentData} />
                    </div>
                </div>
            </div>
        )
    }
}

export default KardexProductos