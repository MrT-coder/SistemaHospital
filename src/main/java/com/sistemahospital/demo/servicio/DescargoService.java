package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;

import com.sistemahospital.demo.dto.DescargoDTO;
import com.sistemahospital.demo.dto.DescargoUpdateDTO;
import com.sistemahospital.demo.dto.LineaDTO;
import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.LineaDeTransaccion;
import com.sistemahospital.demo.modelo.LineaProducto;
import com.sistemahospital.demo.modelo.LineaServicio;

public interface DescargoService {
    List<DescargoDTO> findAll();

    Descargo save(Descargo descargo);

    void delete(Long id);

    LineaServicio addLineaServicio(Long descargoId, Long servicioId, Integer cantidad);

    LineaProducto addLineaProducto(Long descargoId, Long productoId, Integer cantidad);

    DescargoDTO findById(Long id);

    DescargoDTO update(Long id, DescargoUpdateDTO upd);

    public LineaDTO toLineaDTO(LineaDeTransaccion l);

}
