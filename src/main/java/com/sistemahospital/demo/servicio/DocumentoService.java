package com.sistemahospital.demo.servicio;

import java.util.List;

import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.Factura;

public interface DocumentoService {
    Descargo descargarDescargo(Long id);
    Factura facturarDescargo(Long id);
    List<Factura> findAllFacturas();
    Factura findFacturaById(Long id);
    void deleteFactura(Long id);
}
