package com.sistemahospital.demo.controlador;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.Factura;
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
    public ResponseEntity<Factura> facturar(@PathVariable Long id) {
        return ResponseEntity.ok(service.facturarDescargo(id));
    }
}