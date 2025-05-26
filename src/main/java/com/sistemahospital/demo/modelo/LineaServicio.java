package com.sistemahospital.demo.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LineaServicio extends LineaDeTransaccion {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    // Getter/Setter de servicio
    public Servicio getServicio() {
        return servicio;
    }
    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
        // Actualizar precio unitario y recalcular subtotal
        if (servicio != null) {
            setPrecioUnitario(servicio.getPrecio());
        }
    }
    
}