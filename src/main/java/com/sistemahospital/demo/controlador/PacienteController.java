package com.sistemahospital.demo.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.sistemahospital.demo.modelo.Paciente;
import com.sistemahospital.demo.servicio.PacienteService;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Paciente> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> getById(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Paciente create(@Validated @RequestBody Paciente paciente) {
        return service.save(paciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> update(
        @PathVariable Long id,
        @Validated @RequestBody Paciente paciente
    ) {
        try {
            return ResponseEntity.ok(service.update(id, paciente));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}