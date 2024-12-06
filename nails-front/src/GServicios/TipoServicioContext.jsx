// LineaContext.js
import { createContext, useState } from 'react'

export const TipoServicioContext = createContext()

const TipoServicioProvider = ({ children }) => {
  const [tiposServicios, setTiposServicios] = useState([])

  return (
    <TipoServicioContext.Provider value={{ tiposServicios, setTiposServicios }}>
      {children}
    </TipoServicioContext.Provider>
  )
}

export default TipoServicioProvider
