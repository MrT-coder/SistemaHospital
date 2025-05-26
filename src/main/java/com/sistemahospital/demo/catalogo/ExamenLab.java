package com.sistemahospital.demo.catalogo;

import com.sistemahospital.demo.modelo.Servicio;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("EXAMEN_LAB")
public class ExamenLab extends Servicio {

    private String tipoExamen;

    // getters y setters...
    public String getTipoExamen() { return tipoExamen; }
    public void setTipoExamen(String tipoExamen) { this.tipoExamen = tipoExamen; }
}