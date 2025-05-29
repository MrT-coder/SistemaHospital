package com.sistemahospital.demo.controlador;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemahospital.demo.dto.DescargoDTO;
import com.sistemahospital.demo.dto.DescargoUpdateDTO;
import com.sistemahospital.demo.dto.LineaDTO;
import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.LineaProducto;
import com.sistemahospital.demo.modelo.LineaServicio;
import com.sistemahospital.demo.servicio.DescargoService;

@RestController
@RequestMapping("/api/descargos")
public class DescargoController {

    private final DescargoService service;

    public DescargoController(DescargoService service) {
        this.service = service;
    }

    // 1) Listar todos los descargos
    @GetMapping
    public ResponseEntity<List<DescargoDTO>> getAll() {
        List<DescargoDTO> todos = service.findAll();
        return ResponseEntity.ok(todos);
    }

    // 2) Traer un descargo por id
    @GetMapping("/{id}")
    public ResponseEntity<DescargoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // 3) Crear un nuevo descargo
    @PostMapping
    public ResponseEntity<Descargo> create(@Validated @RequestBody Descargo nuevo) {
        Descargo creado = service.save(nuevo);
        return ResponseEntity.status(201).body(creado);
    }

    // 4) Actualizar (p. ej. para cambiar fecha o paciente antes de descargar)
    @PutMapping("/{id}")
    public ResponseEntity<DescargoDTO> update(
            @PathVariable Long id,
            @RequestBody DescargoUpdateDTO upd) {
        return ResponseEntity.ok(service.update(id, upd));
    }

    // 5) Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

   // 6.1) Añadir línea de servicio
    @PostMapping("/{id}/lineas/servicio")
    public ResponseEntity<LineaDTO> addLineaServicio(
        @PathVariable Long id,
        @RequestParam Long servicioId,
        @RequestParam Integer cantidad
    ) {
        LineaServicio linea = service.addLineaServicio(id, servicioId, cantidad);
        LineaDTO dto = service.toLineaDTO(linea);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }

    // 6.2) Añadir línea de producto
    @PostMapping("/{id}/lineas/producto")
    public ResponseEntity<LineaDTO> addLineaProducto(
        @PathVariable Long id,
        @RequestParam Long productoId,
        @RequestParam Integer cantidad
    ) {
        LineaProducto linea = service.addLineaProducto(id, productoId, cantidad);
        LineaDTO dto = service.toLineaDTO(linea);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }
}