import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { obtenerClientesForCombo } from '../Services/ClienteService'
import { newServicio, obtenerServicio } from '../Services/ServicioService'
import { obtenerTiposServiciosForCombo } from '../Services/TipoServicioService'
import { ServicioContext } from './ServicioContext'

export default function Servicio({ title }) {
  let navegacion = useNavigate()
  const { id } = useParams()

  const [servicio, setServicio] = useState({
    denominacion: '',
  })

  const [listaClientes, setListaClientes] = useState([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [tiposServicio, setTiposServicio] = useState([])
  const [servicios, setServicios] = useState([])
  const [total, setTotal] = useState(0) // Estado para el total
  const [errors, setErrors] = useState({
    fecha: '',
    cliente: '',
    servicios: Array(servicios.length).fill({ tipoServicio: '', precio: '' }),
  })

  useEffect(() => {
    cargarModel()
    cargarClientes()
    cargarTipoServicios()
  }, [])

  // Calcular el total cada vez que cambie la lista de servicios
  useEffect(() => {
    const nuevoTotal = servicios.reduce(
      (acc, servicio) => acc + (parseFloat(servicio.precio) || 0),
      0
    )
    setTotal(nuevoTotal)
  }, [servicios])

  const cargarModel = async () => {
    if (id > 0) {
      const resultado = await obtenerServicio(id)
      setServicio(resultado)
      setSelectedCliente(String(resultado.cliente.id)) // Convertir a string
      setFecha(new Date(resultado.fechaDocumento).toISOString().split('T')[0])
      setServicios(resultado.listaItems)
    }
  }

  const cargarClientes = async () => {
    const resultado = await obtenerClientesForCombo()
    setListaClientes(resultado)
  }

  const cargarTipoServicios = async () => {
    const resultado = await obtenerTiposServiciosForCombo()
    setTiposServicio(resultado)
  }

  const handleAddServicio = () => {
    setServicios([
      ...servicios,
      { tipoServicio: '', precio: '', observaciones: '' },
    ])
  }

  const handleServicioChange = (index, event) => {
    const { name, value } = event.target
    const newServicios = [...servicios]

    if (name === 'tipoServicio') {
      const tipoServicioSeleccionado = tiposServicio.find(
        tipo => tipo.id === parseInt(value)
      )
      newServicios[index] = {
        ...newServicios[index],
        tipoServicioId: tipoServicioSeleccionado.id,
        tipoServicio: tipoServicioSeleccionado.denominacion,
      }
    } else {
      newServicios[index] = { ...newServicios[index], [name]: value }
    }
    setServicios(newServicios)
  }

  const onSubmit = async e => {
    e.preventDefault()
    const fechaActual = new Date().toISOString().split('T')[0]

    if (fecha > fechaActual) {
      setErrors(prevErrors => ({
        ...prevErrors,
        fecha: 'La fecha no puede ser mayor a la actual',
      }))
      return
    } else {
      setErrors(prevErrors => ({ ...prevErrors, fecha: '' }))
    }

    if (!selectedCliente) {
      setErrors(prevErrors => ({
        ...prevErrors,
        cliente: 'Debe seleccionar un cliente',
      }))
      return
    } else {
      setErrors(prevErrors => ({ ...prevErrors, cliente: '' }))
    }

    const newServiciosErrors = servicios.map(item => {
      const itemErrors = {}
      if (!item.tipoServicio)
        itemErrors.tipoServicio = 'Debe seleccionar un tipo de servicio'
      if (!item.precio) itemErrors.precio = 'Debe ingresar un precio'
      return itemErrors
    })

    if (newServiciosErrors.some(item => Object.keys(item).length !== 0)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        servicios: newServiciosErrors,
      }))
      return
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        servicios: Array(servicios.length).fill({
          tipoServicio: '',
          precio: '',
        }),
      }))
    }

    const data = {
      ...servicio,
      fechaDocumento: fecha,
      cliente: selectedCliente,
      listaItems: servicios.map(item => ({
        ...item,
        tipoServicioId: item.tipoServicioId,
      })),
    }

    await newServicio(data)
    navegacion('/servicioList')
  }

  return (
    <div className="container">
      <div>
        <h1>Gestión de servicio / {title}</h1>
        <hr />
      </div>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <div>
            <label htmlFor="fecha">Fecha: </label>
            <br />
            <input
              type="date"
              id="fecha"
              value={fecha}
              onClick={null}
              onChange={e => {
                setFecha(new Date(e.target.value).toISOString().split('T')[0])
              }}
            />
            {errors.fecha && <div className="error">{errors.fecha}</div>}
          </div>
        </div>

        <label>Detalle del Servicio:</label>
        <hr />

        <div className="container text-center">
          <div className="row">
            <div className="col">Tipo de Servicio</div>
            <div className="col">Precio</div>
            <div className="col">Observaciones</div>
          </div>
        </div>

        {listaClientes.map((cliente, index) => (
          <div key={index}>
            <input
              type="radio"
              name="cliente"
              value={cliente.id}
              checked={selectedCliente === String(cliente.id)}
              onChange={e => setSelectedCliente(e.target.value)}
            />
            {cliente.razonSocial}
          </div>
        ))}

        {servicios.map((servicio, index) => (
          <div key={index}>
            <select
              name="tipoServicio"
              value={servicio.tipoServicioId || ''} // Aquí usas tipoServicioId
              onChange={e => handleServicioChange(index, e)}>
              <option value="">Seleccione un tipo de servicio</option>
              {tiposServicio.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.denominacion}
                </option> // El value es el ID
              ))}
            </select>
            {errors.servicios[index]?.tipoServicio && (
              <div className="error">
                {errors.servicios[index].tipoServicio}
              </div>
            )}

            <label>Precio:</label>
            <input
              type="number"
              name="precio"
              value={servicio.precio.toLocaleString('de-DE')}
              onChange={e => handleServicioChange(index, e)}
            />
            {errors.servicios[index]?.precio && (
              <div className="error">
                {errors.servicios[index].precio.toLocaleString('de-DE')}
              </div>
            )}

            <label>Observaciones:</label>
            <input
              type="text"
              name="observaciones"
              value={servicio.observaciones}
              onChange={e => handleServicioChange(index, e)}
            />
          </div>
        ))}

        <button type="button" onClick={handleAddServicio}>
          Agregar Servicio
        </button>

        <div>
          <h4>Total: {total}</h4>
        </div>

        <button type="submit">Guardar</button>
      </form>
    </div>
  )
}
