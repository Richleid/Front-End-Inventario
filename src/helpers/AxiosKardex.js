import { ArrayKardexOrdenado } from './ArrayKardexOrdenado'
import Axios from 'axios'
import { FormateadorFecha } from './FormateadorFecha'

const AxiosKardex = async () => {
  let responseCompras
  let responseProductos
  let responseDetalles
  let detallesFiltrados
  let responseVentas = []
  let comprasAux = [], ventasAux = []
  let compras = [], ventas = [], detalles = []
  let productosAux = []
  let jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAxNzI3NDcsImV4cCI6MTY5MDI1OTE0N30.LYt5cNwvhbfwh15Zt1WiL1pXQqCsYqCjuAQBSY5llGQ'

  try {
    responseDetalles = Axios({ url: 'https://inventarioproductos.onrender.com/ajustes', headers: { 'Authorization': `${jwToken}` } })
  } catch (error) {
    console.log('Error en peticion de Axios Kardex detalles: ' + error)
  }
  try {
    responseVentas = Axios('https://facturasapi202307161115.azurewebsites.net/api/FactDetalleFacturas')
  } catch (error) {
    console.log('Error en peticion Axios Kardex ventas: ' + error)
  }
  try {
    responseProductos = Axios({ url: 'https://inventarioproductos.onrender.com/productos', headers: { 'Authorization': `${jwToken}` } })
    productosAux = (await responseProductos).data
  } catch (error) {
    console.log('Error en la peticion Axios de productos ' + error)
  }
  try {
    responseCompras = Axios('https://gr2compras.000webhostapp.com/facturas')
  } catch (error) {
    console.log('Error en peticion Axios Kardex compras: ' + error)
  }
  try {
    detallesFiltrados = (await responseDetalles).data.filter(function (detallesFiltrados) {
      return detallesFiltrados.detalles.length > 0
    })
    detallesFiltrados.forEach(detalleF => {
      detalleF.detalles.forEach(det => {
        let proId = det.pro_id
        let filtroId = productosAux.filter(function (filtroId) {
          return filtroId.pro_id === proId
        })
        if (filtroId.length > 0) {
          let datos = {}
          let fecha = FormateadorFecha(detalleF.aju_fecha)
          datos.fecha = fecha
          datos.idProducto = (det.producto.pro_id).toString()
          datos.nombreProducto = det.producto.pro_nombre
          datos.numeroDocumento = detalleF.aju_numero
          datos.descripcion = detalleF.aju_descripcion
          datos.cantidad = det.aju_det_cantidad
          datos.stock = 0
          detalles.push(datos)
        }
      })
    })
  } catch (error) {
    console.log('Error en responseDetalles')
  }

  try {
    try {
      if (responseVentas) {
        (await responseVentas).data.forEach(venta => {
          ventasAux.push(venta)
        })
      }
    } catch (error) {
      console.log('error en primera ' + error)
    }
    for (let index = 0; index < ventasAux.length; index++) {
      let datos = {}
      let nombreProducto = ''
      let idProductoAux = parseInt(ventasAux[index].idProducto)
      nombreProducto = productosAux.filter(function (nombreProducto) {
        return nombreProducto.pro_id === idProductoAux
      })
      if (nombreProducto.length > 0) {
        let fecha = FormateadorFecha(ventasAux[index].facturaCabecera.fechaFactura)
        datos.fecha = fecha
        datos.idProducto = ventasAux[index].idProducto
        datos.nombreProducto = nombreProducto[0].pro_nombre
        datos.numeroDocumento = ventasAux[index].facturaCabecera.numeroFactura
        datos.descripcion = 'Venta'
        datos.cantidad = ventasAux[index].cantidad * -1
        datos.stock = 0
        ventas.push(datos)
      }
    }

  } catch (error) {
    console.log('Error en responseVentas')
  }
  try {
    (await responseCompras).data.data.forEach(compra => {
      comprasAux.push(compra)
    })
    for (let index = 0; index < comprasAux.length; index++) {
      let productosCompras = []
      productosCompras = Object.entries(comprasAux[index].detalles)
      for (let indexB = 0; indexB < productosCompras.length; indexB++) {
        let datos = {}
        let nombreProducto = ''
        let idProductoAux = parseInt(productosCompras[indexB][1].producto_id)
        nombreProducto = productosAux.filter(function (nombreProducto) {
          return nombreProducto.pro_id === idProductoAux
        })
        if (nombreProducto.length > 0) {
          let fecha = FormateadorFecha(comprasAux[index].fecha_factura)
          datos.fecha = fecha
          datos.idProducto = idProductoAux.toString()
          datos.nombreProducto = nombreProducto[0].pro_nombre
          datos.numeroDocumento = comprasAux[index].id
          datos.descripcion = 'Compra'
          datos.cantidad = productosCompras[indexB][1].cantidad
          datos.stock = 0
          compras.push(datos)
        }
      }
    }
  } catch (error) {
    console.log('Error en responseCompras')
  }

  const response = ArrayKardexOrdenado(compras, ventas, detalles)
  return response
}
export default AxiosKardex