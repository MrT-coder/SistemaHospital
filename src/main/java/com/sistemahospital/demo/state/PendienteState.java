package com.sistemahospital.demo.state;


import org.springframework.stereotype.Component;

import com.sistemahospital.demo.modelo.DocumentoTransaccion;
import com.sistemahospital.demo.modelo.EstadoDocumento;

@Component
public class PendienteState implements DocumentoState {
    @Override
    public void descargar(DocumentoTransaccion doc) {
        // sólo permite descargar desde PENDIENTE
        doc.setEstado(EstadoDocumento.DESCARGADO);
    }
    @Override
    public DocumentoTransaccion facturar(DocumentoTransaccion doc) {
        throw new IllegalStateException("Debe descargarse antes de facturar");
    }
}
