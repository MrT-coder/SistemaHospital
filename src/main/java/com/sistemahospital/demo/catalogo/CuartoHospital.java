package com.sistemahospital.demo.catalogo;

import java.time.LocalDate;

import com.sistemahospital.demo.modelo.Producto;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("CUARTO_HOSPITAL")
public class CuartoHospital extends Producto {

    private String numeroHabitacion;
    private LocalDate fechaCheckIn;
    private LocalDate fechaCheckOut;

    // getters y setters...
    public String getNumeroHabitacion() { return numeroHabitacion; }
    public void setNumeroHabitacion(String numeroHabitacion) {
        this.numeroHabitacion = numeroHabitacion;
    }
    public LocalDate getFechaCheckIn() { return fechaCheckIn; }
    public void setFechaCheckIn(LocalDate fechaCheckIn) { this.fechaCheckIn = fechaCheckIn; }
    public LocalDate getFechaCheckOut() { return fechaCheckOut; }
    public void setFechaCheckOut(LocalDate fechaCheckOut) {
        this.fechaCheckOut = fechaCheckOut;
    }
}