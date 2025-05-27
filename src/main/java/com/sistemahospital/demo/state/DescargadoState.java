package com.sistemahospital.demo.state;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.DocumentoTransaccion;
import com.sistemahospital.demo.modelo.EstadoDocumento;
import com.sistemahospital.demo.modelo.Factura;
import com.sistemahospital.demo.modelo.LineaDeTransaccion;

@Component
public class DescargadoState implements DocumentoState {
    @Override
    public void descargar(DocumentoTransaccion doc) {
        throw new IllegalStateException("Ya está descargado");
    }

    @Override
    public DocumentoTransaccion facturar(DocumentoTransaccion doc) {
        // Descargo → Factura
        Descargo desc = (Descargo) doc;

        // Instanciamos la nueva factura con la cabecera desde descargo
        Factura fac = new Factura();
        String nuevoNro = "FAC-" + desc.getId() + "-" + System.currentTimeMillis();
        fac.setNro(nuevoNro);
        fac.setFecha(desc.getFecha());
        fac.setNroFactura(nuevoNro);
        fac.setFechaEmision(LocalDateTime.now());
        fac.setPaciente(desc.getPaciente());
        fac.setEstado(EstadoDocumento.FACTURADO);
        fac.setValorTotal(BigDecimal.ZERO);

        // Clonamos las lineas de descargo
        for (LineaDeTransaccion lineaDesc : desc.getLineas()) {
            LineaDeTransaccion lineaFac = (LineaDeTransaccion) lineaDesc.clone();
            lineaFac.setDocumento(fac);
            lineaFac.calcularSubtotal();
            fac.addLinea(lineaFac);
        }
        
        return fac;
    }
}