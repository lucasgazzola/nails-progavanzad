// Eliminamos dependencia de axios
// Eliminamos el import de React
// Importamos el contexto y los hooks necesarios
import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArticuloVentaContext } from './ArticuloVentaContext'
// Delegamos al contexto la responsabilidad de manejar el estado

// eslint-disable-next-line react/prop-types
export default function ArticuloVenta({ title }) {
  const {
    articulo,
    listaLineas,
    selectedLinea,
    setSelectedLinea,
    cargarModel,
    onInputChange,
    onSubmit,
  } = useContext(ArticuloVentaContext)

  //TODO:AGREGAR AL INFORME
  // Reemplazamos el uso de let por el uso de const
  // Esto es debido a que no se reasigna el valor de navegacion y const es más optimo
  const navegacion = useNavigate()
  const { id } = useParams()
  const { denominacion, linea } = articulo

  useEffect(() => {
    if (id) {
      // cargarModel ahora viene por props
      // Y le pasamos un id
      cargarModel(id)
    }
  }, [id, cargarModel])

  const handleSubmit = async e => {
    e.preventDefault()
    const success = await onSubmit(articulo)
    if (success) {
      navegacion('/articuloList')
    }
  }

  return (
    <div className="container">
      <div>
        <h1> Gestión de articulo / {title} </h1>
        {/* Cambiamos el <hr></hr> por un <hr /> */}
        <hr />
      </div>
      {/* // handleSubmit lo extraemos afuera para poder manejar excepciones */}
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
            value={denominacion}
            // onInputChange ahora viene por props
            onChange={onInputChange}
          />

          <label htmlFor="listaLineas">Selecciona una linea:</label>
          <select
            id="listaLineas"
            value={selectedLinea}
            required={true}
            // Eliminados paréntesis de no necesarios
            onChange={e => setSelectedLinea(e.target.value)}>
            <option value="">Seleccione...</option>
            {listaLineas.map(linea => (
              <option key={linea.id} value={linea.id}>
                {linea.denominacion}
              </option>
            ))}
          </select>
        </div>

        <div className="row d-md-flex justify-content-md-end">
          <div className="col-4">
            <button type="submit" className="btn btn-success btn-sm me-3">
              Guardar
            </button>
          </div>
          <div className="col-4">
            <a href="/articuloList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
