package edu.bsuir.logistic.rest.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
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

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "idGoods", nullable = false)
    private Goods goods;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "idClient", nullable = false)
    private User client;

    @NotEmpty
    @Column(name = "date", nullable = false)
    @Type(type = "date")
    private Date date;

    @NotEmpty
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
