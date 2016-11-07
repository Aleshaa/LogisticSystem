package edu.bsuir.logistic.rest.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by Alesha on 06.11.2016.
 */
@Entity
@Table(name = "Purchase")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Purchase implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPurchase", unique = true, nullable = false)
    private Integer idPurchase;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "idGoods", nullable = false)
    private Goods goods;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "idClient", nullable = false)
    private User client;

    @NotEmpty
    @Column(name = "frequency", nullable = false)
    private int frequency;

    @NotEmpty
    @Column(name = "quantity", nullable = false)
    private float quantity;

    public Purchase() {
        this.idPurchase = 0;
    }

    public Purchase(Integer idPurchase, Goods goods, User client, int frequency, float quantity) {
        this.idPurchase = idPurchase;
        this.goods = goods;
        this.client = client;
        this.frequency = frequency;
        this.quantity = quantity;
    }

    public Integer getIdPurchase() {
        return idPurchase;
    }

    public void setIdPurchase(Integer idPurchase) {
        this.idPurchase = idPurchase;
    }

    public Goods getGoods() {
        return goods;
    }

    public void setGoods(Goods goods) {
        this.goods = goods;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public float getQuantity() {
        return quantity;
    }

    public void setQuantity(float quantity) {
        this.quantity = quantity;
    }
}
