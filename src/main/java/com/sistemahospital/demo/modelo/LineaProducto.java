package com.sistemahospital.demo.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LineaProducto extends LineaDeTransaccion {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    // Getter/Setter de producto...
    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
        // Actualizar precio unitario y recalcular subtotal
        if (producto != null) {
            setPrecioUnitario(producto.getPrecio());
        }
    }
}