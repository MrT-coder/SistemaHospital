package com.sistemahospital.demo.config;

import com.sistemahospital.demo.modelo.EstadoDocumento;
import com.sistemahospital.demo.state.DocumentoState;
import com.sistemahospital.demo.state.PendienteState;
import com.sistemahospital.demo.state.DescargadoState;
import com.sistemahospital.demo.state.FacturadoState;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.EnumMap;
import java.util.Map;

@Configuration
public class StateConfig {

    @Bean
    public Map<EstadoDocumento, DocumentoState> estados(
        PendienteState pendiente,
        DescargadoState descargado,
        FacturadoState facturado
    ) {
        Map<EstadoDocumento, DocumentoState> map = new EnumMap<>(EstadoDocumento.class);
        map.put(EstadoDocumento.PENDIENTE, pendiente);
        map.put(EstadoDocumento.DESCARGADO, descargado);
        map.put(EstadoDocumento.FACTURADO, facturado);
        return map;
    }
}