package com.sistemahospital.demo.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "documento_transaccion")
public abstract class DocumentoTransaccion implements Prototype {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nro;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDocumento estado;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @OneToMany(
      mappedBy = "documento",
      cascade = CascadeType.ALL,
      orphanRemoval = true
    )
    private List<LineaDeTransaccion> lineas = new ArrayList<>();

    // getters / setters 
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNro() {
        return nro;
    }

    public void setNro(String nro) {
        this.nro = nro;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public EstadoDocumento getEstado() {
        return estado;
    }

    public void setEstado(EstadoDocumento estado) {
        this.estado = estado;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    /** Añade una línea y recalcula el total */
    public void addLinea(LineaDeTransaccion linea) {
        linea.setDocumento(this);
        linea.calcularSubtotal();
        this.lineas.add(linea);
        this.valorTotal = this.valorTotal.add(linea.getSubtotal());
    }

    /** Quita una línea y recalcula el total */
    public void removeLinea(LineaDeTransaccion linea) {
        if (this.lineas.remove(linea)) {
            this.valorTotal = this.valorTotal.subtract(linea.getSubtotal());
            linea.setDocumento(null);
        }
    }

    public List<LineaDeTransaccion> getLineas() {
        return lineas;
    }


    /** Clona el documento (deep copy), se implementa en cada subclase */
    @Override
    public abstract DocumentoTransaccion clone();

     /** Suma los subtotales de las líneas */
    public BigDecimal calcularTotal() {
        return lineas.stream()
            .map(LineaDeTransaccion::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}