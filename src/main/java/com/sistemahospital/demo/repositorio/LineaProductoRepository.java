package com.sistemahospital.demo.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemahospital.demo.modelo.LineaProducto;

public interface LineaProductoRepository extends JpaRepository<LineaProducto, Long> {
  
}
