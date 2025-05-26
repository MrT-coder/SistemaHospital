package com.sistemahospital.demo.catalogo;

import com.sistemahospital.demo.modelo.Servicio;

import jakarta.persistence.*;;

@Entity
@DiscriminatorValue("PROCEDIMIENTO_MEDICO")
public class ProcedimientoMedico extends Servicio {

    private String nombreProcedimiento;

    // getters y setters...
    public String getNombreProcedimiento() { return nombreProcedimiento; }
    public void setNombreProcedimiento(String nombreProcedimiento) {
        this.nombreProcedimiento = nombreProcedimiento;
    }
}
