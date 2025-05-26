package com.sistemahospital.demo.servicio;

import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.Factura;

public interface DocumentoService {
    Descargo descargarDescargo(Long id);
    Factura facturarDescargo(Long id);
}
