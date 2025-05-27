package com.sistemahospital.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.math.BigDecimal;
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
        // --- copia cabecera ---
        copia.setNro(this.getNro());
        copia.setFecha(this.getFecha());
        copia.setPaciente(this.getPaciente());
        copia.setEstado(EstadoDocumento.FACTURADO);
        // campos propios
        copia.setNroFactura("F-" + this.getNro());
        copia.setFechaEmision(LocalDateTime.now());

        // --- inicializamos lista y total desde cero ---
        copia.setValorTotal(BigDecimal.ZERO);
        copia.getLineas().clear();

        // --- clonar líneas de detalle ---
        for (LineaDeTransaccion lineaOrig : this.getLineas()) {
            // cada línea devuelve su propio tipo concreto
            LineaDeTransaccion lineaCopia = lineaOrig.clone();
            // asocia la copia al nuevo documento y recalcula su subtotal
            lineaCopia.setDocumento(copia);
            lineaCopia.calcularSubtotal();
            // añade la línea (y suma su subtotal al valorTotal de la factura)
            copia.addLinea(lineaCopia);
        }

        return copia;
    }
}