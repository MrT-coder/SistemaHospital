package com.sistemahospital.demo.catalogo;

import com.sistemahospital.demo.modelo.Servicio;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("IMAGEN_RAYOS_X")
public class ImagenRayosX extends Servicio {

    private String region;

    // getters y setters...
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
}