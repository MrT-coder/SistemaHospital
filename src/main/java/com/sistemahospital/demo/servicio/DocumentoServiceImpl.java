package com.sistemahospital.demo.servicio;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.EstadoDocumento;
import com.sistemahospital.demo.modelo.Factura;
import com.sistemahospital.demo.repositorio.DescargoRepository;
import com.sistemahospital.demo.repositorio.FacturaRepository;
import com.sistemahospital.demo.state.DocumentoState;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class DocumentoServiceImpl implements DocumentoService {

    private final DescargoRepository descargoRepo;
    private final FacturaRepository facturaRepo;
    private final Map<EstadoDocumento, DocumentoState> estados;

    public DocumentoServiceImpl(DescargoRepository descargoRepo,
                                FacturaRepository facturaRepo,
                                Map<EstadoDocumento, DocumentoState> estados) {
        this.descargoRepo = descargoRepo;
        this.facturaRepo = facturaRepo;
        this.estados = estados;
    }

    @Override
    public Descargo descargarDescargo(Long id) {
        Descargo desc = descargoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Descargo no encontrado: " + id));
        estados.get(desc.getEstado()).descargar(desc);
        return descargoRepo.save(desc);
    }

    @Override
    public Factura facturarDescargo(Long id) {
        Descargo desc = descargoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Descargo no encontrado: " + id));
        DocumentoState state = estados.get(desc.getEstado());
        Factura fac = (Factura) state.facturar(desc);
        fac = facturaRepo.save(fac);

        desc.setEstado(EstadoDocumento.FACTURADO);
        descargoRepo.save(desc);
        return fac;
    }

    @Override
    public List<Factura> findAllFacturas() {
        return facturaRepo.findAll();
    }
    @Override
    public Factura findFacturaById(Long id) {
        return facturaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Factura no encontrada: " + id));
    }
    @Override
    public void deleteFactura(Long id) {
        Factura factura = facturaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Factura no encontrada: " + id));
        facturaRepo.delete(factura);
    }
}