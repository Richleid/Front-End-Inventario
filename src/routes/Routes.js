import { BrowserRouter as Router, Link,Routes, Route } from 'react-router-dom'
import Home from '../components/Home'
import AdminProducts from '../components/AdminProducts'
import ProductosInactivos from '../components/ProductosInactivos'
import Categoria from '../components/Categoria'
import CategoriaInactivas from '../components/CategoriasInactivas'
import CategoriasInactivas from '../components/CategoriasInactivas'

const Rutas = () => {
    return (
            <Routes>
                <Route path='/' element={<Home />}>
                </Route>
                <Route path='/AdminProduct' element={<AdminProducts />}>
                </Route>
                <Route path='/ProductosInactivos' element={<ProductosInactivos />}>
                </Route>
                <Route path='/Categoria' element={<Categoria />}>
                </Route>
                <Route path='/CategoriasInactivas' element={<CategoriasInactivas />}>
                </Route>
                
            </Routes>
    )
}

export default Rutas