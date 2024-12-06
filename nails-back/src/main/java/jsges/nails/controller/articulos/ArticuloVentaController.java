package jsges.nails.controller.articulos;

import jsges.nails.DTO.articulos.ArticuloVentaDTO;
import jsges.nails.mapper.ArticuloVentaMapper;
import jsges.nails.domain.articulos.ArticuloVenta;
import jsges.nails.excepcion.RecursoNoEncontradoExcepcion;
import jsges.nails.service.articulos.IArticuloVentaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(value = "${path_mapping}")
@CrossOrigin(value = "${path_cross}")
public class ArticuloVentaController {
  private static final Logger logger = LoggerFactory.getLogger(ArticuloVentaController.class);
  @Autowired
  private IArticuloVentaService modelService;

  @Autowired
  private ArticuloVentaMapper mapper;

  @GetMapping({ "/articulos" })
  public List<ArticuloVentaDTO> getAll() {
    logger.info("Enta en traer todas los articulos");
    return modelService.listar();
  }

  @GetMapping({ "/articulosPageQuery" })
  public ResponseEntity<Page<ArticuloVentaDTO>> getItems(
      @RequestParam String consulta, @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "${max_page}") int size) {
    return ResponseEntity.ok(modelService.findPaginated(PageRequest.of(page, size), consulta));
  }

  @GetMapping("/articulos/{id}")
  public ResponseEntity<ArticuloVentaDTO> getPorId(@PathVariable Integer id) {
    ArticuloVenta model = modelService.buscarPorId(id);

    return ResponseEntity.ok(mapper.toDTO(model));
  }

  @PostMapping("/articulos")
  public ResponseEntity<ArticuloVentaDTO> agregar(@RequestBody ArticuloVentaDTO dto) {
    return ResponseEntity.ok(modelService.guardar(dto));
  }

  @DeleteMapping("/articuloEliminar/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
    modelService.eliminar(id);

    return ResponseEntity.noContent().build();

  }

  @PutMapping("/articulos/{id}")
  public ResponseEntity<ArticuloVentaDTO> actualizar(@PathVariable Integer id,
      @RequestBody ArticuloVentaDTO modelRecibido) {
    logger.info("articulo " + modelRecibido);
    if (id >= 0 || modelRecibido == null) {
      throw new RecursoNoEncontradoExcepcion("No se encontro el id: " + id);
    }

    return ResponseEntity.ok(modelService.actualizar(id, modelRecibido));

  }

}