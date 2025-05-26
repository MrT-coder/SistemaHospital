package com.sistemahospital.demo.catalogo;

import com.sistemahospital.demo.modelo.Producto;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("COMIDA")
public class Comida extends Producto {

    private String valorNutricional;
    private String tipoComida;

    // getters y setters...
    public String getValorNutricional() { return valorNutricional; }
    public void setValorNutricional(String valorNutricional) {
        this.valorNutricional = valorNutricional;
    }
    public String getTipoComida() { return tipoComida; }
    public void setTipoComida(String tipoComida) { this.tipoComida = tipoComida; }
}