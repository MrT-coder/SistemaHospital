package com.sistemahospital.demo.controlador;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemahospital.demo.dto.FacturaDTO;
import com.sistemahospital.demo.servicio.DocumentoService;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {
    private final DocumentoService documentoService;

    public FacturaController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    // Listar todas las facturas
    @GetMapping
    public ResponseEntity<List<FacturaDTO>> listAll() {
        List<FacturaDTO> dtos = documentoService.findAllFacturas()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Obtener una factura por id
    @GetMapping("/{id}")
    public ResponseEntity<FacturaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(documentoService.findFacturaById(id)));
    }

    private FacturaDTO toDTO(com.sistemahospital.demo.modelo.Factura f) {
    FacturaDTO dto = new FacturaDTO();
    dto.setId(f.getId());
    dto.setNro(f.getNro());
    dto.setFecha(f.getFecha());
    dto.setValorTotal(f.getValorTotal());
    dto.setEstado(f.getEstado().name());
    dto.setPacienteId(f.getPaciente().getId());
    dto.setNroFactura(f.getNroFactura());
    dto.setFechaEmision(f.getFechaEmision());

    dto.setLineas(
        f.getLineas().stream().map(l -> {
            // Creamos la DTO de línea
            com.sistemahospital.demo.dto.LineaDTO ld = new com.sistemahospital.demo.dto.LineaDTO();
            ld.setId(l.getId());
            ld.setCantidad(l.getCantidad());
            ld.setPrecioUnitario(l.getprecioUnitario());
            ld.setSubtotal(l.getSubtotal());

            // Si es línea de servicio, mapeamos el servicio entero
            if (l instanceof com.sistemahospital.demo.modelo.LineaServicio ls) {
                com.sistemahospital.demo.dto.ServicioDTO sd = new com.sistemahospital.demo.dto.ServicioDTO();
                sd.setId(ls.getServicio().getId());
                sd.setDescripcion(ls.getServicio().getDescripcion());
                sd.setPrecio(ls.getServicio().getPrecio());
                ld.setServicio(sd);
            }
            // Si es línea de producto, mapeamos el producto entero
            else if (l instanceof com.sistemahospital.demo.modelo.LineaProducto lp) {
                com.sistemahospital.demo.dto.ProductoDTO pd = new com.sistemahospital.demo.dto.ProductoDTO();
                pd.setId(lp.getProducto().getId());
                pd.setDescripcion(lp.getProducto().getDescripcion());
                pd.setPrecio(lp.getProducto().getPrecio());
                ld.setProducto(pd);
            }

            return ld;
        }).collect(Collectors.toList())
    );

    return dto;
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentoService.deleteFactura(id);
        return ResponseEntity.noContent().build();
    }
}
