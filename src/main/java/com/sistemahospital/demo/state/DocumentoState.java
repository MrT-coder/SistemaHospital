package com.sistemahospital.demo.state;

import com.sistemahospital.demo.modelo.DocumentoTransaccion;

public interface DocumentoState {
    /** Transición: PENDIENTE → DESCARGADO */
    void descargar(DocumentoTransaccion doc);

    /** Transición: DESCARGADO → FACTURADO */
    DocumentoTransaccion facturar(DocumentoTransaccion doc);
}