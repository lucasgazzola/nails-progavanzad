import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ClienteContext } from './ClienteContext'

export default function Cliente({ title }) {
  const { cliente, cargarCliente, onInputChange, onSubmit } =
    useContext(ClienteContext)
  const { id } = useParams()
  const navegacion = useNavigate()

  useEffect(() => {
    if (id) {
      cargarCliente(id)
    }
  }, [id, cargarCliente])

  const handleSubmit = async e => {
    e.preventDefault()
    const success = await onSubmit(id)
    if (success) {
      navegacion('/clienteList')
    }
  }

  return (
    <div className="container">
      <div>
        <h1> Gestión de Clientes / {title} </h1>
        <hr />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="razonSocial" className="form-label">
            Apellido Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="razonSocial"
            name="razonSocial"
            required
            value={cliente.razonSocial || ''}
            onChange={onInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="celular" className="form-label">
            Celular
          </label>
          <input
            type="number"
            className="form-control"
            id="celular"
            name="celular"
            required
            value={cliente.celular}
            onChange={onInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mail" className="form-label">
            Mail
          </label>
          <input
            type="email"
            className="form-control"
            id="mail"
            name="mail"
            value={cliente.mail}
            onChange={onInputChange}
          />
        </div>

        <div className="row d-md-flex justify-content-md-end">
          <div className="col-4">
            <button type="submit" className="btn btn-success btn-sm me-3">
              Guardar
            </button>
          </div>
          <div className="col-4">
            <a href="/clienteList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
