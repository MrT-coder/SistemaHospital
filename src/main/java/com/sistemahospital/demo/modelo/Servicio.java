package com.sistemahospital.demo.modelo;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.sistemahospital.demo.catalogo.AtencionMedica;
import com.sistemahospital.demo.catalogo.ExamenLab;
import com.sistemahospital.demo.catalogo.ImagenRayosX;
import com.sistemahospital.demo.catalogo.ProcedimientoMedico;

import jakarta.persistence.*;

@Entity
@Table(name = "servicios")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "servicio_tipo", discriminatorType = DiscriminatorType.STRING)
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "servicioTipo"    // coincide con tu discriminator
)
@JsonSubTypes({
  @JsonSubTypes.Type(value = AtencionMedica.class,      name = "ATENCION_MEDICA"),
  @JsonSubTypes.Type(value = ExamenLab.class,           name = "EXAMEN_LAB"),
  @JsonSubTypes.Type(value = ImagenRayosX.class,        name = "IMAGEN_RAYOS_X"),
  @JsonSubTypes.Type(value = ProcedimientoMedico.class, name = "PROCEDIMIENTO_MEDICO")
})
public abstract class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    // getters y setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}