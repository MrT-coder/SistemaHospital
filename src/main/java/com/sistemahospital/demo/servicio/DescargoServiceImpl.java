package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.EstadoDocumento;
import com.sistemahospital.demo.modelo.LineaProducto;
import com.sistemahospital.demo.modelo.LineaServicio;
import com.sistemahospital.demo.modelo.Producto;
import com.sistemahospital.demo.modelo.Servicio;
import com.sistemahospital.demo.repositorio.DescargoRepository;
import com.sistemahospital.demo.repositorio.ProductoRepository;
import com.sistemahospital.demo.repositorio.ServicioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class DescargoServiceImpl implements DescargoService {

    private final DescargoRepository repo;
    private final ServicioRepository servicioRepo;
    private final ProductoRepository productoRepo;


   public DescargoServiceImpl(DescargoRepository repo, ServicioRepository servicioRepo, ProductoRepository productoRepo) {
        this.repo = repo;
        this.servicioRepo = servicioRepo;
        this.productoRepo = productoRepo;
    }

    public List<Descargo> findAll() {
        return repo.findAll();
    }

    public Optional<Descargo> findById(Long id) {
        return repo.findById(id);
    }

    public Descargo save(Descargo descargo) {
        // puedes inicializar estado PENDIENTE aquí
        descargo.setEstado(EstadoDocumento.PENDIENTE);
        return repo.save(descargo);
    }

    public Optional<Descargo> update(Long id, Descargo cambios) {
        return repo.findById(id).map(existing -> {
            existing.setFecha(cambios.getFecha());
            existing.setPaciente(cambios.getPaciente());
            // otros campos si los hay
            return repo.save(existing);
        });
    }

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
        linea.setServicio(serv);
        linea.setCantidad(cantidad);
        linea.setPrecioUnitario(serv.getPrecio());

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
        linea.setProducto(prod);
        linea.setCantidad(cantidad);
        linea.setPrecioUnitario(prod.getPrecio());

        desc.addLinea(linea);
        repo.save(desc);
        return linea;
    }
}