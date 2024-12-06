package jsges.nails.Service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import jsges.nails.DTO.articulos.LineaDTO;
import jsges.nails.domain.articulos.Linea;
import jsges.nails.excepcion.RecursoNoEncontradoExcepcion;
import jsges.nails.repository.articulos.LineaRepository;
import jsges.nails.service.articulos.LineaService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class LineaServiceTest {

  @Mock
  private LineaRepository modelRepository;

  @InjectMocks
  private LineaService lineaService;

  @Test
  public void testActualizarLineaConParametrosNulos_ThrowsException() {
    assertThrows(RecursoNoEncontradoExcepcion.class, () -> lineaService.guardar(null));
  }

  @Test
  public void testObtenerTodasLasLineas() {
    Linea model1 = new Linea();
    Linea model2 = new Linea();
    when(modelRepository.buscarNoEliminados()).thenReturn(java.util.Arrays.asList(model1, model2));

    Iterable<Linea> lineas = lineaService.listar();

    assertNotNull(lineas);
    assertEquals(2, ((java.util.List<Linea>) lineas).size());
  }

  @Test
  public void testManejoExcepcionesRepositorio() {

    when(modelRepository.save(any(Linea.class))).thenThrow(new RuntimeException("Error"));

    assertThrows(RuntimeException.class, () -> lineaService.guardar(new Linea()));
  }

  @Test
  public void testEstadoLineaEliminada() {

    Linea model = new Linea();
    model.setEstado(0);

    model.asEliminado();

    assertEquals(1, model.getEstado());
  }

  public void testListarNoEliminados() {
    Linea linea1 = new Linea();
    Linea linea2 = new Linea();
    when(modelRepository.buscarNoEliminados()).thenReturn(Arrays.asList(linea1, linea2));

    List<Linea> result = lineaService.listar();

    assertNotNull(result);
    assertEquals(2, result.size());
  }

  @Test
  public void testBuscarPorIdExiste() {
    Linea linea = new Linea();
    when(modelRepository.findById(1L)).thenReturn(Optional.of(linea));

    Linea result = lineaService.buscarPorId(1L);

    assertNotNull(result);
    assertEquals(linea, result);
  }

  @Test
  public void testBuscarPorIdNoExiste() {
    when(modelRepository.findById(1L)).thenReturn(Optional.empty());

    assertThrows(RecursoNoEncontradoExcepcion.class, () -> lineaService.buscarPorId(1L));
  }

  @Test
  public void testGuardarLinea() {
    Linea linea = new Linea();
    when(modelRepository.save(linea)).thenReturn(linea);

    Linea result = lineaService.guardar(linea);

    assertNotNull(result);
    assertEquals(linea, result);
  }

  @Test
  public void testGuardarLineaNula() {
    assertThrows(RecursoNoEncontradoExcepcion.class, () -> lineaService.guardar(null));
  }

  @Test
  public void testEliminarLinea() {
    Linea linea = new Linea();
    lineaService.eliminar(linea);

    verify(modelRepository, times(1)).save(linea);
  }

  @Test
  public void testMarcarComoEliminadoLineaExistente() {
    Linea linea = new Linea();
    when(modelRepository.findById(1L)).thenReturn(Optional.of(linea));

    lineaService.marcarComoEliminado(1L);

    assertEquals(1, linea.getEstado());
    verify(modelRepository, times(1)).save(linea);
  }

  @Test
  public void testMarcarComoEliminadoLineaNoExistente() {
    when(modelRepository.findById(1L)).thenReturn(Optional.empty());

    assertThrows(RecursoNoEncontradoExcepcion.class, () -> lineaService.marcarComoEliminado(1L));
  }

  @Test
  public void testActualizarLinea() {
    Linea linea = new Linea();
    LineaDTO lineaDTO = new LineaDTO();
    lineaDTO.setDenominacion("Nueva Denominacion");
    when(modelRepository.findById(1L)).thenReturn(Optional.of(linea));

    lineaService.actualizarLinea(1L, lineaDTO);

    assertEquals("Nueva Denominacion", linea.getDenominacion());
    verify(modelRepository, times(1)).save(linea);
  }

  @Test
  public void testActualizarLineaNoExiste() {
    LineaDTO lineaDTO = new LineaDTO();
    when(modelRepository.findById(1L)).thenReturn(Optional.empty());

    assertThrows(RecursoNoEncontradoExcepcion.class, () -> lineaService.actualizarLinea(1, lineaDTO));
  }

  @Test
  public void testFindPaginated() {
    LineaDTO lineaDTO1 = new LineaDTO();
    LineaDTO lineaDTO2 = new LineaDTO();
    List<LineaDTO> lineaDTOList = Arrays.asList(lineaDTO1, lineaDTO2);
    PageRequest pageable = PageRequest.of(0, 1);

    Page<LineaDTO> paginatedResult = lineaService.findPaginated(pageable, lineaDTOList);

    assertEquals(1, paginatedResult.getSize());
    assertEquals(2, paginatedResult.getTotalElements());
  }

}
