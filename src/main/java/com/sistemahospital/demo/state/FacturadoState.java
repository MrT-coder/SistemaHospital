package com.sistemahospital.demo.state;


import org.springframework.stereotype.Component;

import com.sistemahospital.demo.modelo.DocumentoTransaccion;

@Component
public class FacturadoState implements DocumentoState {
    @Override
    public void descargar(DocumentoTransaccion doc) {
        throw new IllegalStateException("Ya está facturado");
    }
    @Override
    public DocumentoTransaccion facturar(DocumentoTransaccion doc) {
        throw new IllegalStateException("Ya está facturado");
    }
}