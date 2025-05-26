package com.sistemahospital.demo.repositorio;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemahospital.demo.modelo.Factura;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> { }