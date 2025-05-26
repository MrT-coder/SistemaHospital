package com.sistemahospital.demo.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemahospital.demo.modelo.Servicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
}
