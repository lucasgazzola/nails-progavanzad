import { createContext, useEffect, useState } from 'react'
import {
  newArticuloVenta,
  obtenerArticuloVenta,
} from '../Services/ArticuloVentaService'
import { obtenerLineas2 } from '../Services/LineaService'

export const ArticuloVentaContext = createContext()

// eslint-disable-next-line react/prop-types
const ArticuloVentaProvider = ({ children }) => {
  const [articulo, setArticulo] = useState({ denominacion: '', linea: 0 })
  const [listaLineas, setListaLineas] = useState([])
  const [selectedLinea, setSelectedLinea] = useState({})

  // Fetch the article data (if id exists)
  const cargarModel = async id => {
    if (id > 0) {
      const resultado = await obtenerArticuloVenta(id)
      setArticulo(resultado)
      setSelectedLinea(resultado.linea)
    }
  }

  // Fetch the available lineas (categories)
  const cargarLineas = async () => {
    const resultado = await obtenerLineas2()
    setListaLineas(resultado)
  }

  const onInputChange = ({ target: { name, value } }) => {
    setArticulo({ ...articulo, [name]: value })
  }

  const onSubmit = async data => {
    const newData = { ...data, linea: selectedLinea }
    await newArticuloVenta(newData)
  }

  useEffect(() => {
    cargarLineas()
  }, [])

  return (
    <ArticuloVentaContext.Provider
      value={{
        articulo,
        setArticulo,
        listaLineas,
        selectedLinea,
        setSelectedLinea,
        cargarModel,
        onInputChange,
        onSubmit,
      }}>
      {children}
    </ArticuloVentaContext.Provider>
  )
}

export default ArticuloVentaProvider
