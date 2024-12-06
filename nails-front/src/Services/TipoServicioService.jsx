import axios from 'axios'
import { API_URL } from '../app.config'

export async function obtenerTiposServicios(consulta, page, pageSize) {
  try {
    const urlBase = API_URL + '/tiposServiciosPageQuery'
    const { data } = await axios({
      method: 'GET',
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    })
    return data
  } catch (error) {
    console.error('Error buscando tipos de servicios:', error)
    throw error
  }
}

export async function obtenerTiposServiciosForCombo() {
  try {
    const urlBase = API_URL + '/tiposServicios'
    const { data } = await axios({
      method: 'GET',
      url: `${urlBase}`,
    })
    return data
  } catch (error) {
    console.error('Error buscando tipos de servicios:', error)
    throw error
  }
}

export async function obtenerTipoServicio(id) {
  try {
    const { data } = await axios({
      method: 'GET',
      url: `${API_URL}/tiposServicios/${id}`,
    })
    return data
  } catch (error) {
    console.error('Error en buscar un tipo servicio', error)
    throw error
  }
}

export async function newTipoServicio(tipoServicio) {
  try {
    const { data } = await axios({
      method: 'POST',
      url: `${API_URL}/tiposServicios`,
      data: tipoServicio,
    })
    return data
  } catch (e) {
    console.error(e)
    if (e.response && e.response.status === 400) {
      alert('Error: Los datos proporcionados son inválidos')
    } else {
      console.error(e.response)
    }
    return null
  }
}

export async function eliminarTipoServicio(id) {
  const urlBase = API_URL + '/tipoServicio'
  await axios({
    method: 'DELETE',
    url: `${urlBase}/${id}`,
  })
}
