import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { IMAGEN_DELETE } from '../app.config'
import { ServicioContext } from './ServicioContext'

export default function ListadoServicio() {
  const {
    consulta,
    page,
    totalPages,
    sortConfig,
    loading,
    error,
    selected,
    selectedData,
    handlePageChange,
    handleConsultaChange,
    handleSort,
    sortedData,
    eliminar,
    getDatos,
    setSelected,
    getDatosItems,
  } = useContext(ServicioContext)

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <div className="container">
      <div>
        <h1>Gestión de servicios</h1>
        <hr />
      </div>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-5">
          <input
            id="consulta"
            name="consulta"
            className="form-control"
            type="search"
            placeholder="Buscar servicio"
            value={consulta}
            onChange={handleConsultaChange}
          />
        </div>
        <div className="col-1">
          <button
            onClick={() => getDatos()}
            className="btn btn-outline-success">
            Buscar
          </button>
        </div>
      </div>

      <hr />

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th scope="col" onClick={() => handleSort('id')}>
                  #
                  {sortConfig.key === 'id' && (
                    <span>
                      {sortConfig.direction === 'ascending' ? ' 🔽' : ' 🔼'}
                    </span>
                  )}
                </th>
                <th scope="col" onClick={() => handleSort('cliente')}>
                  Cliente
                  {sortConfig.key === 'cliente' && (
                    <span>
                      {sortConfig.direction === 'ascending' ? ' 🔽' : ' 🔼'}
                    </span>
                  )}
                </th>
                <th scope="col" onClick={() => handleSort('fecha')}>
                  Fecha
                  {sortConfig.key === 'fecha' && (
                    <span>
                      {sortConfig.direction === 'ascending' ? ' 🔽' : ' 🔼'}
                    </span>
                  )}
                </th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedData().map((servicio, indice) => (
                <tr key={indice}>
                  <th scope="row">{servicio.id}</th>
                  <td>{servicio.cliente}</td>
                  <td>
                    {new Date(servicio.fechaDocumento).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td className="text-center">
                    <div>
                      <button
                        onClick={() => {
                          setSelected(servicio.id)
                          getDatosItems(servicio.id)
                        }}
                        className="btn btn-link btn-sm me-3">
                        Ver
                      </button>
                      <button
                        onClick={() => eliminar(servicio.id)}
                        className="btn btn-link btn-sm me-3">
                        <img
                          src={IMAGEN_DELETE}
                          style={{ width: '20px', height: '20px' }}
                        />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-md-flex justify-content-md-end">
            <button
              className="btn btn-outline-primary me-2"
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1)}>
              Anterior
            </button>
            <button
              className="btn btn-outline-primary"
              disabled={page >= totalPages - 1}
              onClick={() => handlePageChange(page + 1)}>
              Siguiente
            </button>
          </div>

          <div className="row d-md-flex justify-content-md-end mt-3">
            <div className="col-4">
              <Link to={`/servicio`} className="btn btn-success btn-sm">
                Nuevo
              </Link>
            </div>
            <div className="col-4">
              <Link to={`/`} className="btn btn-info btn-sm">
                Regresar
              </Link>
            </div>
          </div>
        </>
      )}

      {selected && (
        <table className="table mt-5 table-striped table-hover align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th scope="col" onClick={() => handleSort('observaciones')}>
                Observaciones
              </th>
              <th scope="col" onClick={() => handleSort('precio')}>
                Precio
              </th>
              <th scope="col" onClick={() => handleSort('tipoServicio')}>
                Tipo de Servicio
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedData?.listaItems?.map(item => (
              <tr key={item?.id}>
                <td>{item?.observaciones}</td>
                <td>{USDollar.format(item?.precio)}</td>
                <td>{item?.tipoServicio}</td>
              </tr>
            ))}
            <tr className="table-secondary">
              <td colSpan={2} className="text-right">
                <strong>Total</strong>
              </td>
              <td>
                {USDollar.format(
                  selectedData?.listaItems.reduce(
                    (acum, item) => acum + item.precio,
                    0
                  )
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
