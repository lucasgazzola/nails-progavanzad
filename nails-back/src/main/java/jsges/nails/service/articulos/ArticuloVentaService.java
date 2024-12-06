package jsges.nails.service.articulos;

import jsges.nails.DTO.articulos.ArticuloVentaDTO;
import jsges.nails.controller.articulos.ArticuloVentaController;
import jsges.nails.mapper.ArticuloVentaMapper;
import jsges.nails.domain.articulos.ArticuloVenta;
import jsges.nails.repository.articulos.ArticuloVentaRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ArticuloVentaService implements IArticuloVentaService {
  private static final Logger logger = LoggerFactory.getLogger(ArticuloVentaController.class);

  @Autowired
  private ArticuloVentaRepository modelRepository;

  @Autowired
  private LineaService lineaService;

  @Autowired
  private ArticuloVentaMapper mapper;

  @Override
  public List<ArticuloVentaDTO> listar() {
    List<ArticuloVenta> articuloVentas = modelRepository.buscarNoEliminados();
    return articuloVentas.stream().map(mapper::toDTO).toList();
  }

  @Override
  public ArticuloVenta buscarPorId(long id) {
    return modelRepository.findById(id).orElse(null);
  }

  @Override
  public ArticuloVentaDTO guardar(ArticuloVentaDTO dto) {
    ArticuloVenta model = mapper.toEntity(dto);
    model.setEstado(0);
    model.setLinea(lineaService.buscarPorId(dto.getLinea()));

    return mapper.toDTO(modelRepository.save(model));
  }

  @Override
  public void eliminar(long id) {
    ArticuloVenta model = modelRepository.findById(id).orElse(null);
    model.asEliminado();
    modelRepository.save(model);
  }

  @Override
  public List<ArticuloVenta> listar(String consulta) {
    return modelRepository.buscarNoEliminados(consulta);
  }

  @Override
  public Page<ArticuloVenta> getArticulos(Pageable pageable) {
    return modelRepository.findAll(pageable);
  }

  @Override
  public Page<ArticuloVentaDTO> findPaginated(PageRequest pageRequest, String consulta) {
    logger.info("Enta en traer todas los articulos");
    int start = (int) pageRequest.getOffset();
    List<ArticuloVentaDTO> listado = listar(consulta).stream().map(mapper::toDTO).toList();
    int end = Math.min(start + pageRequest.getPageSize(), listado.size());
    return new PageImpl<>(listado.subList(start, end), pageRequest, listado.size());
  }

  @Override
  public ArticuloVentaDTO actualizar(long id, ArticuloVentaDTO dto) {
    ArticuloVenta model = modelRepository.findById(id).orElse(null);
    model.setDenominacion(dto.getDenominacion());
    model.setLinea(lineaService.buscarPorId(dto.getLinea()));
    return mapper.toDTO(modelRepository.save(model));
  }

}