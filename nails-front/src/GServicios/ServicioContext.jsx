import { createContext, useState, useEffect } from 'react'
import {
  eliminarServicio,
  obtenerServicios,
  obtenerServicio,
} from '../Services/ServicioService'
import { ITEMS_PER_PAGE } from '../app.config'

export const ServicioContext = createContext()

const ServicioProvider = ({ children }) => {
  const [servicios, setServicios] = useState([])
  const [consulta, setConsulta] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE)
  const [totalPages, setTotalPages] = useState(0)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [selectedData, setSelectedData] = useState(null)

  useEffect(() => {
    getDatos()
  }, [page, pageSize, consulta])

  const getDatos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await obtenerServicios(consulta, page, pageSize)
      setServicios(response.content)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError('Error fetching items')
    } finally {
      setLoading(false)
    }
  }

  const getDatosItems = async id => {
    try {
      const response = await obtenerServicio(id)
      console.log({ response })
      setSelectedData(response)
    } catch (err) {
      setError('Error fetching item details')
    } finally {
      setLoading(false)
    }
  }

  const eliminar = async id => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await eliminarServicio(id)
        await getDatos()
      } catch (error) {
        console.error('Error al eliminar el servicio', error)
      }
    }
  }

  const handlePageChange = newPage => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }

  const handleConsultaChange = e => {
    setConsulta(e.target.value)
  }

  const handleSort = key => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = () => {
    const sorted = [...servicios]
    if (sortConfig.key !== null) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sorted
  }

  return (
    <ServicioContext.Provider
      value={{
        servicios,
        consulta,
        page,
        pageSize,
        totalPages,
        sortConfig,
        loading,
        error,
        selected,
        selectedData,
        setServicios,
        setConsulta,
        setPage,
        setPageSize,
        setTotalPages,
        setSortConfig,
        setLoading,
        setError,
        setSelected,
        setSelectedData,
        getDatos,
        getDatosItems,
        eliminar,
        handlePageChange,
        handleConsultaChange,
        handleSort,
        sortedData,
      }}>
      {children}
    </ServicioContext.Provider>
  )
}

export default ServicioProvider
