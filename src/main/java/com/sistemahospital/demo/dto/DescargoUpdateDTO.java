package com.sistemahospital.demo.dto;

import java.time.LocalDateTime;

public class DescargoUpdateDTO {
    private String nro;
    private LocalDateTime fecha;
    private Long pacienteId;
    // puedes añadir más campos si fuera necesario

    // getters y setters
    public String getNro() {
        return nro;
    }
    public void setNro(String nro) {
        this.nro = nro;
    }
    public LocalDateTime getFecha() {
        return fecha;
    }
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
    public Long getPacienteId() {
        return pacienteId;
    }
    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }
}