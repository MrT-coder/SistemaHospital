package com.sistemahospital.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DescargoDTO {
    private Long id;
    private String nro;
    private LocalDateTime fecha;
    private LocalDateTime fechaDescargo;
    private BigDecimal valorTotal;
    private Long pacienteId;

    // getters y setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
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
    public LocalDateTime getFechaDescargo() {
        return fechaDescargo;
    }
    public void setFechaDescargo(LocalDateTime fechaDescargo) {
        this.fechaDescargo = fechaDescargo;
    }
    public BigDecimal getValorTotal() {
        return valorTotal;
    }
    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
    public Long getPacienteId() {
        return pacienteId;
    }
    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;}
}
