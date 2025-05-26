package com.sistemahospital.demo.repositorio;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemahospital.demo.modelo.Descargo;

@Repository
public interface DescargoRepository extends JpaRepository<Descargo, Long> { }