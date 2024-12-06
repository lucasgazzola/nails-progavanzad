import axios from 'axios'
import { createContext, useCallback, useState } from 'react'
import { API_URL } from '../app.config'
import { obtenerCliente } from '../Services/ClienteService'

export const ClienteContext = createContext()

const ClienteProvider = ({ children }) => {
  const urlBase = `${API_URL}/clientes`
  const [cliente, setCliente] = useState({
    razonSocial: '',
    celular: '',
    mail: '',
  })

  const cargarCliente = useCallback(async id => {
    if (id > 0) {
      const resultado = await obtenerCliente(id)
      setCliente(resultado)
    }
  }, [])

  const onInputChange = ({ target: { name, value } }) => {
    setCliente({ ...cliente, [name]: value })
  }

  const onSubmit = async id => {
    if (id > 0) {
      await axios.put(`${urlBase}/${id}`, cliente)
    } else {
      await axios.post(urlBase, cliente)
    }
    return true
  }

  return (
    <ClienteContext.Provider
      value={{
        cliente,
        setCliente,
        cargarCliente,
        onInputChange,
        onSubmit,
      }}>
      {children}
    </ClienteContext.Provider>
  )
}

export default ClienteProvider
