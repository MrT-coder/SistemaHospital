package com.sistemahospital.demo.controlador;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemahospital.demo.dto.DescargoDTO;
import com.sistemahospital.demo.dto.FacturaDTO;
import com.sistemahospital.demo.dto.LineaDTO;
import com.sistemahospital.demo.dto.ProductoDTO;
import com.sistemahospital.demo.dto.ServicioDTO;
import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.Factura;
import com.sistemahospital.demo.modelo.LineaProducto;
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
    public ResponseEntity<DescargoDTO> descargar(@PathVariable Long id) {
        Descargo descargo = service.descargarDescargo(id);
        return ResponseEntity.ok(toDTO(descargo));
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

    // Mapeamos las líneas de la factura
    dto.setLineas(
        f.getLineas().stream().map(l -> {
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
        }).collect(Collectors.toList())
    );

    return dto;
}

    // Convierte un Descargo a su DTO correspondiente
    private DescargoDTO toDTO(Descargo d) {
        DescargoDTO dto = new DescargoDTO();
        dto.setId(d.getId());
        dto.setNro(d.getNro());
        dto.setFecha(d.getFecha());
        dto.setFechaDescargo(d.getFechaDescargo());
        dto.setValorTotal(d.getValorTotal());
        dto.setEstado(d.getEstado());
        dto.setPacienteId(d.getPaciente().getId());

        // Mapeamos las líneas del descargo
        dto.setLineas(
            d.getLineas().stream()
                .map(l -> {
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
                }).collect(Collectors.toList())
        );

        return dto;
    }
}