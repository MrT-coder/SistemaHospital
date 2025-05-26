package com.sistemahospital.demo.catalogo;

import com.sistemahospital.demo.modelo.Producto;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("MEDICINA")
public class Medicina extends Producto {

    private String laboratorio;
    private String dosis;

    // getters y setters...
    public String getLaboratorio() { return laboratorio; }
    public void setLaboratorio(String laboratorio) { this.laboratorio = laboratorio; }
    public String getDosis() { return dosis; }
    public void setDosis(String dosis) { this.dosis = dosis; }
}