package edu.bsuir.logistic.rest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Alesha on 06.11.2016.
 */
@Entity
@Table(name = "Address")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Address implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAddress", unique = true, nullable = false)
    private Integer idAddress;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "idUser", nullable = true)
    private User user;

    @NotEmpty
    @Column(name = "Country", nullable = false)
    private String Country;

    @NotEmpty
    @Column(name = "City", nullable = false)
    private String City;

    @NotEmpty
    @Column(name = "Street", nullable = false)
    private String Street;

    @NotEmpty
    @Column(name = "Number", nullable = false)
    private int Number;

    @NotEmpty
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "m2m_goods_address",
            joinColumns = {@JoinColumn(name = "idAddress")},
            inverseJoinColumns = {@JoinColumn(name = "idGoods")})
    private Set<Goods> goodsSet = new HashSet<>();

    public Address() {
        this.idAddress = 0;
    }

    public Address(Integer idAddress, User user, String country, String city, String street, int number) {
        this.idAddress = idAddress;
        this.user = user;
        Country = country;
        City = city;
        Street = street;
        Number = number;
    }

    public Integer getIdAddress() {
        return idAddress;
    }

    public void setIdAddress(Integer idAddress) {
        this.idAddress = idAddress;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCountry() {
        return Country;
    }

    public void setCountry(String country) {
        Country = country;
    }

    public String getCity() {
        return City;
    }

    public void setCity(String city) {
        City = city;
    }

    public String getStreet() {
        return Street;
    }

    public void setStreet(String street) {
        Street = street;
    }

    public int getNumber() {
        return Number;
    }

    public void setNumber(int number) {
        Number = number;
    }

    @JsonIgnore
    public Set<Goods> getGoodsSet() {
        return goodsSet;
    }

    public void setGoodsSet(Set<Goods> goodsSet) {
        this.goodsSet = goodsSet;
    }
}
