package com.sistemahospital.demo.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemahospital.demo.modelo.Producto;


@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
