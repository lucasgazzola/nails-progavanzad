import axios from 'axios'
import { API_URL } from '../app.config'

const urlBase = API_URL + '/articulosPageQuery'
export async function obtenerArticulosVenta(consulta, page, pageSize) {
  console.log(consulta)
  try {
    const { data } = await axios({
      method: 'GET',
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    })
    return data
  } catch (error) {
    console.error('Error buscando articulos:', error)
    throw error
  }
}

export async function obtenerArticuloVenta(id) {
  try {
    const { data } = await axios({
      method: 'GET',
      url: `${API_URL}/articulos/${id}`,
    })
    return data
  } catch (error) {
    console.error('Error en buscar una articulo:', error)
    throw error
  }
}

export async function newArticuloVenta(model) {
  try {
    console.log(model)
    const { data } = await axios({
      method: 'POST',
      url: `${API_URL}/articulos`,
      data: model,
    })

    return data
  } catch (e) {
    return null
  }
}

export async function eliminarArticulosVenta(id) {
  const urlBase = API_URL + '/articulosEliminar'
  await axios({
    method: 'PUT',
    url: `${urlBase}/${id}`,
  })
  return true
}
