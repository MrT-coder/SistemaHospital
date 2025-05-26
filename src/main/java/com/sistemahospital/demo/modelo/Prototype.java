package com.sistemahospital.demo.modelo;

public interface Prototype {
    /**
     * Devuelve una copia independiente del documento.
     */
    DocumentoTransaccion clone();
}