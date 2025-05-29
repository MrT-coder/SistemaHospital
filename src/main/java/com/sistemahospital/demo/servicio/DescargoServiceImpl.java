package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sistemahospital.demo.dto.DescargoDTO;
import com.sistemahospital.demo.dto.DescargoUpdateDTO;
import com.sistemahospital.demo.dto.LineaDTO;
import com.sistemahospital.demo.dto.ProductoDTO;
import com.sistemahospital.demo.dto.ServicioDTO;
import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.EstadoDocumento;
import com.sistemahospital.demo.modelo.LineaDeTransaccion;
import com.sistemahospital.demo.modelo.LineaProducto;
import com.sistemahospital.demo.modelo.LineaServicio;
import com.sistemahospital.demo.modelo.Paciente;
import com.sistemahospital.demo.modelo.Producto;
import com.sistemahospital.demo.modelo.Servicio;
import com.sistemahospital.demo.repositorio.DescargoRepository;
import com.sistemahospital.demo.repositorio.PacienteRepository;
import com.sistemahospital.demo.repositorio.ProductoRepository;
import com.sistemahospital.demo.repositorio.ServicioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class DescargoServiceImpl implements DescargoService {

    private final DescargoRepository repo;
    private final ServicioRepository servicioRepo;
    private final ProductoRepository productoRepo;
    private final PacienteRepository pacienteRepo;

    public DescargoServiceImpl(DescargoRepository repo, ServicioRepository servicioRepo,
            ProductoRepository productoRepo, PacienteRepository pacienteRepo) {
        this.repo = repo;
        this.servicioRepo = servicioRepo;
        this.productoRepo = productoRepo;
        this.pacienteRepo = pacienteRepo;
    }

   public LineaDTO toLineaDTO(LineaDeTransaccion l) {
    LineaDTO ld = new LineaDTO();
    ld.setId(l.getId());
    ld.setCantidad(l.getCantidad());
    ld.setPrecioUnitario(l.getprecioUnitario());
    ld.setSubtotal(l.getSubtotal());

    if (l instanceof LineaServicio ls) {
        // Mapeamos el servicio completo
        ServicioDTO sd = new ServicioDTO();
        sd.setId(ls.getServicio().getId());
        sd.setDescripcion(ls.getServicio().getDescripcion());
        sd.setPrecio(ls.getServicio().getPrecio());
        ld.setServicio(sd);

    } else if (l instanceof LineaProducto lp) {
        // Mapeamos el producto completo
        ProductoDTO pd = new ProductoDTO();
        pd.setId(lp.getProducto().getId());
        pd.setDescripcion(lp.getProducto().getDescripcion());
        pd.setPrecio(lp.getProducto().getPrecio());
        ld.setProducto(pd);
    }

    return ld;
}

    // Convierte un Descargo a su DTO correspondiente
    public DescargoDTO toDTO(Descargo d) {
        DescargoDTO dto = new DescargoDTO();
        dto.setId(d.getId());
        dto.setNro(d.getNro());
        dto.setFecha(d.getFecha());
        dto.setFechaDescargo(d.getFechaDescargo());
        dto.setValorTotal(d.getValorTotal());
        dto.setEstado(d.getEstado());
        dto.setPacienteId(d.getPaciente().getId());

        // ← aquí mapeas las líneas
        List<LineaDTO> lineas = d.getLineas().stream()
                .map(this::toLineaDTO)
                .collect(Collectors.toList());
        dto.setLineas(lineas);

        return dto;
    }

    @Override
    public DescargoDTO findById(Long id) {
        Descargo d = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No encontrado"));
        return toDTO(d);
    }

    @Override
    public DescargoDTO update(Long id, DescargoUpdateDTO upd) {
        Descargo existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Descargo no encontrado"));
        existing.setNro(upd.getNro());
        existing.setFecha(upd.getFecha());
        // solo cambiamos paciente si viene id
        if (upd.getPacienteId() != null) {
            Paciente p = pacienteRepo.findById(upd.getPacienteId())
                    .orElseThrow(() -> new RuntimeException("Paciente no existe"));
            existing.setPaciente(p);
        }
        Descargo saved = repo.save(existing);
        return toDTO(saved);
    }

    @Override
    public List<DescargoDTO> findAll() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // public Optional<Descargo> findById(Long id) {
    // return repo.findById(id);
    // }

    public Descargo save(Descargo descargo) {
        // puedes inicializar estado PENDIENTE aquí
        descargo.setEstado(EstadoDocumento.PENDIENTE);
        return repo.save(descargo);
    }

    // public Optional<Descargo> update(Long id, Descargo cambios) {
    // return repo.findById(id).map(existing -> {
    // existing.setFecha(cambios.getFecha());
    // existing.setPaciente(cambios.getPaciente());
    // // otros campos si los hay
    // return repo.save(existing);
    // });
    // }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public LineaServicio addLineaServicio(Long descargoId, Long servicioId, Integer cantidad) {
        Descargo desc = repo.findById(descargoId)
                .orElseThrow(() -> new RuntimeException("Descargo no encontrado: " + descargoId));
        Servicio serv = servicioRepo.findById(servicioId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado: " + servicioId));

        LineaServicio linea = new LineaServicio();
        linea.setCantidad(cantidad);
        linea.setPrecioUnitario(serv.getPrecio());
        linea.setServicio(serv);

        desc.addLinea(linea);
        repo.save(desc); // persiste también la nueva línea
        return linea;
    }

    @Override
    public LineaProducto addLineaProducto(Long descargoId, Long productoId, Integer cantidad) {
        Descargo desc = repo.findById(descargoId)
                .orElseThrow(() -> new RuntimeException("Descargo no encontrado: " + descargoId));
        Producto prod = productoRepo.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        LineaProducto linea = new LineaProducto();
        linea.setCantidad(cantidad);
        linea.setPrecioUnitario(prod.getPrecio());
        linea.setProducto(prod);

        desc.addLinea(linea);
        repo.save(desc);
        return linea;
    }
}