package edu.bsuir.logistic.rest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Set;

/**
 * Created by Alesha on 06.11.2016.
 */
@Entity
@Table(name = "Address")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Address implements Serializable {

    private static final long serialVersionUID = -7788619177798333712L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAddress", unique = true, nullable = false)
    private Integer idAddress;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
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

    @NotNull
    @Column(name = "Number", nullable = false)
    private int Number;

    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinTable(name = "m2m_goods_address",
            joinColumns = {@JoinColumn(name = "idAddress")},
            inverseJoinColumns = {@JoinColumn(name = "idGoods")})
    @Fetch(FetchMode.JOIN)
    private Set<Goods> goodsSet;

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

    @Override
    public boolean equals(Object obj) {
        return obj instanceof Address && (obj == this || this.idAddress.equals(((Address) obj).idAddress));
    }

    @Override
    public int hashCode() {
        int result = 17;
        result = 31 * result + idAddress.hashCode();
        return result;
    }
}
