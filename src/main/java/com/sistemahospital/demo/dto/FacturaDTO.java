package com.sistemahospital.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class FacturaDTO {
    private Long id;
    private String nro;
    private LocalDateTime fecha;
    private BigDecimal valorTotal;
    private String estado;
    private Long pacienteId;
    private List<LineaDTO> lineas;
    private String nroFactura;
    private LocalDateTime fechaEmision;
    // getters y setters...
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
    public BigDecimal getValorTotal() {
        return valorTotal;
    }
    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    public Long getPacienteId() {
        return pacienteId;
    }
    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }
    public List<LineaDTO> getLineas() {
        return lineas;
    }
    public void setLineas(List<LineaDTO> lineas) {
        this.lineas = lineas;
    }
    public String getNroFactura() {
        return nroFactura;
    }
    public void setNroFactura(String nroFactura) {
        this.nroFactura = nroFactura;
    }
    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }
    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    
}