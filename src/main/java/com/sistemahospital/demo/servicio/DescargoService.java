package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;

import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.LineaProducto;
import com.sistemahospital.demo.modelo.LineaServicio;

public interface DescargoService {
    List<Descargo> findAll();

    Optional<Descargo> findById(Long id);

    Descargo save(Descargo descargo);

    Optional<Descargo> update(Long id, Descargo cambios);

    void delete(Long id);

    LineaServicio addLineaServicio(Long descargoId, Long servicioId, Integer cantidad);

    LineaProducto addLineaProducto(Long descargoId, Long productoId, Integer cantidad);

}
