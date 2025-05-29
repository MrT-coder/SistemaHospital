package com.sistemahospital.demo.dto;

public class PacienteDTO {
    private Long id;
  private String nombre;
  private String documentoIdentidad;
  // getters / setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getdocumentoIdentidad(){
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

}
