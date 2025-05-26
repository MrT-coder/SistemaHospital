package com.sistemahospital.demo.catalogo;

import java.time.Duration;

import com.sistemahospital.demo.modelo.Servicio;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ATENCION_MEDICA")
public class AtencionMedica extends Servicio {

    private Duration duracion;
    private String medico;

    // getters y setters...
    public Duration getDuracion() { return duracion; }
    public void setDuracion(Duration duracion) { this.duracion = duracion; }
    public String getMedico() { return medico; }
    public void setMedico(String medico) { this.medico = medico; }
}