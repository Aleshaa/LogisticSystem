package edu.bsuir.logistic.rest.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by Alesha on 06.11.2016.
 */
@Entity
@Table(name = "Buy")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Buy implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idBuy", unique = true, nullable = false)
    private Integer idBuy;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "idGoods", nullable = false)
    private Goods goods;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "idClient", nullable = false)
    private User client;

    @NotNull
    @Column(name = "date", nullable = false)
    @Temporal(javax.persistence.TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date date;

    @NotNull
    @Column(name = "quantity", nullable = false)
    private float quantity;

    public Buy() {
        this.idBuy = 0;
    }

    public Buy(Integer idBuy, Goods goods, User client, Date date, float quantity) {
        this.idBuy = idBuy;
        this.goods = goods;
        this.client = client;
        this.date = date;
        this.quantity = quantity;
    }

    public Integer getIdBuy() {
        return idBuy;
    }

    public void setIdBuy(Integer idBuy) {
        this.idBuy = idBuy;
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public float getQuantity() {
        return quantity;
    }

    public void setQuantity(float quantity) {
        this.quantity = quantity;
    }
}
