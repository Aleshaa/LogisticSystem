package edu.bsuir.logistic.rest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Alesha on 06.11.2016.
 */
@Entity
@Table(name = "Goods")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Goods implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idGoods", unique = true, nullable = false)
    private Integer idGoods;

    @NotEmpty
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "about", nullable = true)
    private String about;

    @NotEmpty
    @Column(name = "quantity", nullable = false)
    private float quantity;

    @NotEmpty
    @Column(name = "price", nullable = false)
    private float price;

    @NotEmpty
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "m2m_goods_address",
            joinColumns = {@JoinColumn(name = "idGoods")},
            inverseJoinColumns = {@JoinColumn(name = "idAddress")})
    private Set<Address> addressSet = new HashSet<Address>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "goods")
    @Fetch(FetchMode.JOIN)
    private Set<Buy> buySet;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "goods")
    @Fetch(FetchMode.JOIN)
    private Set<Purchase> purchases;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "goods")
    @Fetch(FetchMode.JOIN)
    private Set<Supply> supplies;

    public Goods() {
        this.idGoods = 0;
    }

    public Goods(Integer idGoods, String name, String about, float quantity, float price) {
        this.idGoods = idGoods;
        this.name = name;
        this.about = about;
        this.quantity = quantity;
        this.price = price;
    }

    public Integer getIdGoods() {
        return idGoods;
    }

    public void setIdGoods(Integer idGoods) {
        this.idGoods = idGoods;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public float getQuantity() {
        return quantity;
    }

    public void setQuantity(float quantity) {
        this.quantity = quantity;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    @JsonIgnore
    public Set<Address> getAddressSet() {
        return addressSet;
    }

    public void setAddressSet(Set<Address> addressSet) {
        this.addressSet = addressSet;
    }

    @JsonIgnore
    public Set<Buy> getBuySet() {
        return buySet;
    }

    public void setBuySet(Set<Buy> buySet) {
        this.buySet = buySet;
    }

    @JsonIgnore
    public Set<Purchase> getPurchases() {
        return purchases;
    }

    public void setPurchases(Set<Purchase> purchases) {
        this.purchases = purchases;
    }

    @JsonIgnore
    public Set<Supply> getSupplies() {
        return supplies;
    }

    public void setSupplies(Set<Supply> supplies) {
        this.supplies = supplies;
    }
}
