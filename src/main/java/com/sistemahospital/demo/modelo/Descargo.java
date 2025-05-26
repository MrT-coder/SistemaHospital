package com.sistemahospital.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;

@Entity
public class Descargo extends DocumentoTransaccion {

    @Column(nullable = false)
    private LocalDateTime fechaDescargo;

    // Constructores
    public Descargo() {
        super();
        this.fechaDescargo = LocalDateTime.now(); 
    }

    // Getters y setters
    public LocalDateTime getFechaDescargo() {
        return fechaDescargo;
    }

    public void setFechaDescargo(LocalDateTime fechaDescargo) {
        this.fechaDescargo = fechaDescargo;
    }

    @Override
    public Descargo clone() {
        Descargo copia = new Descargo();
        copia.setNro(this.getNro());
        copia.setFecha(this.getFecha());
        copia.setPaciente(this.getPaciente());
        copia.setValorTotal(this.getValorTotal());
        copia.setEstado(this.getEstado());
        copia.setFechaDescargo(LocalDateTime.now());
        // aquí clonarías también las líneas cuando estén implementadas
        return copia;
    }
}