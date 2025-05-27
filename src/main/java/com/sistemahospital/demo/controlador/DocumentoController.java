package com.sistemahospital.demo.controlador;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemahospital.demo.dto.FacturaDTO;
import com.sistemahospital.demo.dto.LineaDTO;
import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.Factura;
import com.sistemahospital.demo.modelo.LineaServicio;
import com.sistemahospital.demo.servicio.DocumentoService;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    private final DocumentoService service;

    public DocumentoController(DocumentoService service) {
        this.service = service;
    }

    @PostMapping("/descargos/{id}/descargar")
    public ResponseEntity<Descargo> descargar(@PathVariable Long id) {
        return ResponseEntity.ok(service.descargarDescargo(id));
    }

     @PostMapping("/descargos/{id}/facturar")
    public ResponseEntity<FacturaDTO> facturar(@PathVariable Long id) {
        Factura factura = service.facturarDescargo(id);
        return ResponseEntity.ok(toDTO(factura));
    }

    private FacturaDTO toDTO(Factura f) {
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
                    LineaDTO ld = new LineaDTO();
                    ld.setId(l.getId());
                    ld.setCantidad(l.getCantidad());
                    ld.setPrecioUnitario(l.getprecioUnitario());
                    ld.setSubtotal(l.getSubtotal());
                    if (l instanceof LineaServicio) {
                        ld.setServicioId(((LineaServicio) l).getServicio().getId());
                    }
                    return ld;
                }).collect(Collectors.toList()));
        return dto;
    }
}