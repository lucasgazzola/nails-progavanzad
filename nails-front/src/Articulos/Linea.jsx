import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LineaContext } from './LineaContext'

// eslint-disable-next-line react/prop-types
export default function Linea({ title }) {
  const { linea, cargarModel, onInputChange, onSubmit } =
    useContext(LineaContext)
  const { id } = useParams()
  const navegacion = useNavigate()

  useEffect(() => {
    if (id) {
      cargarModel(id)
    }
  }, [id, cargarModel])

  const handleSubmit = async e => {
    e.preventDefault()
    const success = await onSubmit(linea)
    if (success) {
      navegacion('/lineaList')
    }
  }

  return (
    <div className="container">
      <div>
        <h1> Gestión de Linea / {title} </h1>
        <hr />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="denominacion" className="form-label">
            Denominacion
          </label>
          <input
            type="text"
            className="form-control"
            id="denominacion"
            name="denominacion"
            required={true}
            value={linea.denominacion || ''}
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
            <a href="/lineaList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
