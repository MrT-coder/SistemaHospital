package com.sistemahospital.demo.dto;

import java.math.BigDecimal;

public class ServicioDTO {
    private Long id;
    private String descripcion;
    private BigDecimal precio;
    // getters y setters...
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public BigDecimal getPrecio() {
        return precio;
    }
    public void setPrecio(BigDecimal precio){
        this.precio = precio;
    }
}