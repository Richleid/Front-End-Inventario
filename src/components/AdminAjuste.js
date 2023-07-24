import React, { useState,useContext } from 'react';
import Switch from '@mui/material/Switch'
import AxiosAjustes from '../helpers/AxiosAjustes';
import { useEffect } from 'react';
import CircularWithValueLabel from '../helpers/CircularProgressWithLabel'
import { FormateadorFecha } from '../helpers/FormateadorFecha';
import Axios from 'axios';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css'
import moment from 'moment';
import SelectDropDown from './Select/SelectDropDown';
import UserContext from '../UserContext';

const AdminAjuste = () => {
    const [probando, setProbando] = useState()
    const [idAjuste, setIdAjuste] = useState()
    const [idDetAjuste, setIdDetAjuste] = useState()
    const { user } = useContext(UserContext);
    const [fecha, setFecha] = useState(new Date())
    const [ajuConsultado, setAjuConsultado] = useState({
        aud_usuario:user,
        aju_numero: '',
        aju_fecha: '',
        aju_descripcion: '',
        aju_estado: ''
    })
    const [ajuDetConsultado, setAjuDetConsultado] = useState({
        aud_usuario:user,
        aju_det_id: '',
        productoId: '',
        aju_det_cantidad: '',
        aju_det_modificable: '',
        aju_det_estado: ''
    })
    const [ajustes, setAjustes] = useState([])
    const [ajuDetalles, setAjuDetalles] = useState([])
    const [estadoAjuste, setEstadoAjuste] = useState()
    const [estadoDetalleAjuste, setEstadoDetalleAjuste] = useState()
    const [modificableDetalleAjuste, setModificableDetalleAjuste] = useState()
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAxNzI3NDcsImV4cCI6MTY5MDI1OTE0N30.LYt5cNwvhbfwh15Zt1WiL1pXQqCsYqCjuAQBSY5llGQ'
    let responseAjuste
    let responseDetAjuste

    let buscarAjuste = () => {
        let ajusBuscado = ajustes.filter(function (ajusBuscado) {
            return ajusBuscado.aju_numero === idAjuste
        })
        if (ajusBuscado.length > 0) {
            let fechaAjuste = FormateadorFecha(ajusBuscado[0].aju_fecha)
            setAjuConsultado({
                aud_usuario:user,
                aju_numero: `${ajusBuscado[0].aju_numero}`,
                aju_fecha: `${fechaAjuste}`,
                aju_descripcion: `${ajusBuscado[0].aju_descripcion}`,
                aju_estado: ajusBuscado[0].aju_estado
            })
            setIdDetAjuste(0)
            const originalDateStr = ajusBuscado[0].aju_fecha.slice(0, -1);
            const originalDate = new Date(originalDateStr);
            const options = {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZoneName: "short",
            };
            const formattedDate = new Date(originalDate.toLocaleString("en-US", options));
            setFecha(formattedDate)
            setEstadoAjuste(ajusBuscado[0].aju_estado)
            if (ajusBuscado[0].detalles.length > 0) {
                setAjuDetalles(prevDetalles => [...ajusBuscado[0].detalles])
            }
        } else {
            setAjuConsultado({
                aud_usuario:user,
                aju_numero: ``,
                aju_fecha: ``,
                aju_descripcion: ``,
                aju_estado: ``
            })
            setAjuDetConsultado({
                aud_usuario:user,
                aju_det_id: ``,
                productoId: ``,
                aju_det_cantidad: ``,
                aju_det_modificable: ``,
                aju_det_estado: ``
            })
        }
    }

    const buscarAjusDetalles = () => {
        if (ajuDetalles.length > 0) {
            let ajuDetBuscado = ajuDetalles.filter(function (ajuDetBuscado) {
                return ajuDetBuscado.aju_det_id === parseInt(idDetAjuste)
            })
            if (ajuDetBuscado.length > 0) {
                setAjuDetConsultado({
                    aud_usuario:user,
                    aju_det_id: `${ajuDetBuscado[0].aju_det_id}`,
                    productoId: `${ajuDetBuscado[0].pro_id}`,
                    aju_det_cantidad: `${ajuDetBuscado[0].aju_det_cantidad}`,
                    aju_det_modificable: ajuDetBuscado[0].aju_det_modificable,
                    aju_det_estado: ajuDetBuscado[0].aju_det_estado
                })
                setEstadoDetalleAjuste(ajuDetBuscado[0].aju_det_estado)
                setModificableDetalleAjuste(ajuDetBuscado[0].aju_det_modificable)
            } else {
                setAjuDetConsultado({
                    aud_usuario:user,
                    aju_det_id: ``,
                    productoId: ``,
                    aju_det_cantidad: ``,
                    aju_det_modificable: ``,
                    aju_det_estado: ``
                })
            }
        }
    }

    useEffect(() => {
        if (ajuDetalles.length > 0) {
            buscarAjusDetalles()
        }
    }, [idDetAjuste])

    useEffect(() => {
        if (ajustes) {
            buscarAjuste()
        }
    }, [idAjuste])

    useEffect(() => {
        AxiosAjustes().then((resp) => { setAjustes(resp) })
    }, [])

    const handlerEstadoAjuste = () => {
        setEstadoAjuste(!estadoAjuste)
    }

    useEffect(() => {
        setAjuConsultado(prevState => ({
            ...prevState,
            aju_estado: estadoAjuste
        }))
    }, [estadoAjuste])

    const handlerEstadoDetalle = () => {
        setEstadoDetalleAjuste(!estadoDetalleAjuste)
    }

    useEffect(() => {
        setAjuDetConsultado(prevState => ({
            ...prevState,
            aju_det_estado: estadoDetalleAjuste
        }))
    }, [estadoDetalleAjuste])

    const handlerModificableDetalle = () => {
        setModificableDetalleAjuste(!modificableDetalleAjuste)
    }

    useEffect(() => {
        setAjuDetConsultado(prevState => ({
            ...prevState,
            aju_det_modificable: modificableDetalleAjuste
        }))
    }, [modificableDetalleAjuste])

    const handlerCambiarIdAjuste = (event) => {
        setIdAjuste(event.target.value)
    }

    const handlerCambiarDescripcionAjuste = (event) => {
        setAjuConsultado(prevState => ({
            ...prevState,
            aju_descripcion: event.target.value
        }))
    }

    const handlerCambiarProductoIdAjusteDetalle = (event) => {
        setAjuDetConsultado(prevState => ({
            ...prevState,
            productoId: event.target.value
        }))
    }

    const handlerCambiarCantidadAjusteDetalle = (event) => {
        setAjuDetConsultado(prevState => ({
            ...prevState,
            aju_det_cantidad: event.target.value
        }))
    }

    const handlerSelectDropDown = (dataSelectDropDown) => {
        setIdDetAjuste(dataSelectDropDown)
    }

    const onChangeFecha = (fecha) => {
        console.log(fecha)
        setFecha(fecha)
    }
    const onClickActualizarAjuste = async () => {
        responseAjuste = await Axios({ method: 'PUT', url: 'https://inventarioproductos.onrender.com/updateAjuste', data: ajuConsultado, headers: { 'Authorization': `${jwToken}` } }).catch(function (error) { console.log(error) })
        setAjuConsultado({
            aud_usuario:user,
            aju_numero: ``,
            aju_fecha: ``,
            aju_descripcion: ``,
            aju_estado: ``
        })
        setAjustes([])
        if (await responseAjuste.statusText === 'OK') {
            setTimeout(() => {
                AxiosAjustes().then((resp) => { setAjustes(resp) })
                alert('Actualizando ajuste...')
            }, 1000);
        }
    }

    const onClickActualizarDetalleAjuste = async () => {
        let ajusteDetalles = { ...ajuDetConsultado }
        delete ajusteDetalles.productoId
        setIdDetAjuste()
        responseDetAjuste = await Axios({ method: 'PUT', url: 'https://inventarioproductos.onrender.com/updateAjusteDetalle', data: ajusteDetalles, headers: { 'Authorization': `${jwToken}` } }).catch(function (error) { console.log(error) })
        setAjuDetConsultado({
            aju_det_id: ``,
            productoId: ``,
            aju_det_cantidad: ``,
            aju_det_modificable: ``,
            aju_det_estado: ``
        })
        setAjustes([])
        if (await responseDetAjuste.statusText === 'OK') {
            setTimeout(() => {
                AxiosAjustes().then((resp) => { setAjustes(resp) })
                alert('Actualizando ajuste detalle...')
            }, 1000);
        }
    }

    useEffect(() => {
        let fechaIngresada = moment(fecha).format('YYYY-MM-DD')
        setAjuConsultado(prevState => ({
            ...prevState,
            aju_fecha: fechaIngresada
        }))
    }, [fecha])

    useEffect(() => {
        console.log(ajuDetalles.length)
    }, [ajuDetalles])
    useEffect(() => {
        console.log(ajustes)
    }, [ajustes])

    if (ajustes.length === 0) {
        return (
            <div className='flex flex-col justify-center align-middle'>
                <CircularWithValueLabel />
            </div>
        )
    } else {
        return (
            <div className='border-dark-purple md:mt-24 rounded-md'>
                <div className='w-full sm:ml-3 bg-dark-purple grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border-2 md:p-4'>
                    <div className='w-full'>
                        <div className='p-2'>
                            <h1 className='text-white text-lg'> Datos Ajuste: </h1>
                        </div>
                        <div className='p-5 w-full grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <input type='text' name='pro_id' className='w-full cursor-pointer rounded-md border-2 hover:border-black duration-200' placeholder={`${ajuConsultado.aju_numero ? `${ajuConsultado.aju_numero}` : 'Ingrese el numero de ajuste'}`} onChange={handlerCambiarIdAjuste} />
                            <ReactDatePicker className='rounded-md' selected={fecha} onChange={onChangeFecha} dateFormat={'yyyy-MM-dd'} />
                            <input className='w-full h-6 cursor-pointer rounded-md border-2 hover:border-black duration-200' placeholder={`${ajuConsultado.aju_descripcion ? `${ajuConsultado.aju_descripcion}` : 'Descripción'}`} onChange={handlerCambiarDescripcionAjuste}></input>
                            <div className='rounded-md flex flex-row'>
                                <div className='text-white mt-0'>Estado:</div>
                                <Switch {...label} checked={estadoAjuste} onChange={handlerEstadoAjuste}></Switch>
                            </div>
                            <div className='bg-white text-center rounded-md border-2 cursor-pointer hover:border-dark-purple' onClick={onClickActualizarAjuste}>Actualizar</div>
                        </div>
                        <div className=''>
                            <div className='p-2'>
                                <div className='text-white text-lg'>Ingrese el numero del detalle:</div>
                            </div>
                            <div className='mt-2'>
                                {ajuDetalles.length > 0 ? <SelectDropDown detallesAjuste={ajuDetalles} onSelectIdDetAjuste={handlerSelectDropDown}/> : <SelectDropDown/> }
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex flex-col'>
                        <div className='pl-2 col-span-2 flex flex-col'>
                            <div className=''>
                                <div className='text-white text-lg'>Detalle de ajuste:</div>
                            </div>
                        </div>
                        <div className='p-5 rounded-md w-full gap-4'>
                            <div className='bg-white border border-black rounded-md'>
                                <div className='m-2'>
                                    <h1 >Producto ID: </h1>
                                    <input type='text' name='pro_valor_iva' disabled={true} className='w-full rounded-md border-2 hover:border-black duration-200' placeholder={`${ajuDetConsultado ? `${ajuDetConsultado.productoId}` : 'Producto ID'}`} onChange={handlerCambiarProductoIdAjusteDetalle} />
                                </div>
                                <div className='m-2'>
                                    <h1>Cantidad: </h1>
                                    <input className='w-full rounded-md border-2 hover:border-black duration-200' placeholder={`${ajuDetConsultado ? `${ajuDetConsultado.aju_det_cantidad}` : 'aju_det_cantidad'}`} onChange={handlerCambiarCantidadAjusteDetalle}></input>
                                </div>
                                <div className='m-2'>
                                    <h1 >Modificable: </h1>
                                    <Switch {...label} checked={modificableDetalleAjuste} onClick={handlerModificableDetalle}></Switch>
                                </div>
                                <div className='m-2'>
                                    <h1 >Estado: </h1>
                                    <Switch {...label} checked={estadoDetalleAjuste} onClick={handlerEstadoDetalle}></Switch>
                                </div>
                                <div className='m-2'>
                                    <div className='bg-blue-300 rounded-md cursor-pointer p-1 border-2 flex justify-center hover:border-black duration-200' onClick={onClickActualizarDetalleAjuste}>Actualizar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminAjuste;