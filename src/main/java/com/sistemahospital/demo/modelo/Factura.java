package com.sistemahospital.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;

@Entity
public class Factura extends DocumentoTransaccion {

    @Column(nullable = false, unique = true)
    private String nroFactura;

    @Column(nullable = false)
    private LocalDateTime fechaEmision;

    // getters / setters...
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

    @Override
    public Factura clone() {
        Factura copia = new Factura();
        copia.setNro(this.getNro());
        copia.setFecha(this.getFecha());
        copia.setPaciente(this.getPaciente());
        copia.setValorTotal(this.getValorTotal());
        copia.setEstado(this.getEstado());
        // establecemos campos propios
        copia.setNroFactura("F-" + this.getNro());
        copia.setFechaEmision(LocalDateTime.now());
        // clonar líneas también
        return copia;
    }
}