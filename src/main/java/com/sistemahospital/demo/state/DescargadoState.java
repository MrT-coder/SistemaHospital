package com.sistemahospital.demo.state;


import org.springframework.stereotype.Component;

import com.sistemahospital.demo.modelo.DocumentoTransaccion;
import com.sistemahospital.demo.modelo.EstadoDocumento;
import com.sistemahospital.demo.modelo.Factura;

@Component
public class DescargadoState implements DocumentoState {
    @Override
    public void descargar(DocumentoTransaccion doc) {
        throw new IllegalStateException("Ya está descargado");
    }
    @Override
    public DocumentoTransaccion facturar(DocumentoTransaccion doc) {
        // clona como factura y cambia estado
        Factura factura = ((Factura) doc.clone()); 
        factura.setEstado(EstadoDocumento.FACTURADO);
        return factura;
    }
}