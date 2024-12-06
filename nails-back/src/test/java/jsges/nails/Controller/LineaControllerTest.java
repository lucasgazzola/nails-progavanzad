package jsges.nails.Controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import jsges.nails.DTO.articulos.LineaDTO;
import jsges.nails.mapper.LineaMapper;
import jsges.nails.controller.articulos.LineaController;
import jsges.nails.domain.articulos.Linea;
import jsges.nails.service.articulos.ILineaService;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LineaControllerTest {

  @Mock
  private ILineaService modelService;

  @Mock
  private LineaMapper mapper;

  @InjectMocks
  private LineaController controller;

  @Test
  public void testGetAll() {

    Linea model = new Linea();
    when(modelService.listar()).thenReturn(Collections.singletonList(model));

    ResponseEntity<List<Linea>> response = controller.getAll();

    assertEquals(ResponseEntity.ok(Collections.singletonList(model)), response);
  }

  @Test
  public void testGetItems_WithQuery() {

    String consulta = "someQuery";
    int page = 0;
    int size = 10;
    LineaDTO dto = new LineaDTO();
    Page<LineaDTO> pageResult = new PageImpl<>(Collections.singletonList(dto));
    when(modelService.findPaginated(PageRequest.of(page, size), consulta)).thenReturn(pageResult);

    ResponseEntity<Page<LineaDTO>> response = controller.getItems(consulta, page, size);

    assertEquals(ResponseEntity.ok(pageResult), response);
  }

  @Test
  public void testGetPorId_ExistingId() {

    LineaDTO dto = new LineaDTO();
    when(modelService.buscarDTOPorId(1)).thenReturn(dto);

    ResponseEntity<LineaDTO> response = controller.getPorId(1);

    assertEquals(ResponseEntity.ok(dto), response);
  }

  @Test
  public void testGetPorId_NonExistingId_ThrowsException() {

    when(modelService.buscarDTOPorId(99)).thenThrow(new NullPointerException());

    assertThrows(NullPointerException.class, () -> controller.getPorId(99));
  }

  @Test
  public void testActualizar_UpdatesLinea() {

    LineaDTO modelRecibido = new LineaDTO();
    modelRecibido.setDenominacion("Linea actualizada");
    Linea updatedModel = new Linea();
    updatedModel.setDenominacion("Linea actualizada");

    when(modelService.actualizarLinea(1, modelRecibido)).thenReturn(updatedModel);

    ResponseEntity<Linea> response = controller.actualizar(1, modelRecibido);

    assertEquals(ResponseEntity.ok(updatedModel), response);
  }

  @Test
  public void testActualizar_NonExistingId_ThrowsException() {

    LineaDTO modelRecibido = new LineaDTO();
    when(modelService.actualizarLinea(99, modelRecibido)).thenThrow(new NullPointerException());

    assertThrows(NullPointerException.class, () -> controller.actualizar(99, modelRecibido));
  }

}
