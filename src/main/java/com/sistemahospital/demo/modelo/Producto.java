package com.sistemahospital.demo.modelo;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.sistemahospital.demo.catalogo.Comida;
import com.sistemahospital.demo.catalogo.CuartoHospital;
import com.sistemahospital.demo.catalogo.Medicina;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "producto_tipo", discriminatorType = DiscriminatorType.STRING)

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "productoTipo")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Medicina.class, name = "MEDICINA"),
        @JsonSubTypes.Type(value = Comida.class, name = "COMIDA"),
        @JsonSubTypes.Type(value = CuartoHospital.class, name = "CUARTO_HOSPITAL")
})
public abstract class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    // getters y setters...
    public Long getId() {
        return id;
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

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

}