import { createContext, useState, useCallback } from 'react'
import { newLinea, obtenerLinea } from '../Services/LineaService'

export const LineaContext = createContext()

// eslint-disable-next-line react/prop-types
const LineaProvider = ({ children }) => {
  const [linea, setLinea] = useState({ denominacion: '' })

  // Fetch the linea data based on ID
  const cargarModel = useCallback(async id => {
    if (id > 0) {
      const resultado = await obtenerLinea(id)
      setLinea(resultado)
    }
  }, [])

  const onInputChange = ({ target: { name, value } }) => {
    setLinea({ ...linea, [name]: value })
  }

  const onSubmit = async data => {
    await newLinea(data)
    return true
  }

  return (
    <LineaContext.Provider
      value={{
        linea,
        setLinea,
        cargarModel,
        onInputChange,
        onSubmit,
      }}>
      {children}
    </LineaContext.Provider>
  )
}

export default LineaProvider
