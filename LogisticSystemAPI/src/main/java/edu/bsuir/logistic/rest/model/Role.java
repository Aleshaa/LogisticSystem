package edu.bsuir.logistic.rest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

/**
 * Created by Alesha on 31.10.2016.
 */
@Entity
@Table(name = "Role")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Role implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRole", unique = true, nullable = false)
    private Integer idRole;

    @NotEmpty
    @Column(name = "NameRole", nullable = false)
    private String nameRole;

    @OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY, mappedBy = "role")
    @Fetch(FetchMode.JOIN)
    private Set<User> users;

    @JsonIgnore
    public Set<User> getUsers() {
        return this.users;
    }

    public Integer getIdRole() {
        return idRole;
    }

    public void setIdRole(Integer idRole) {
        this.idRole = idRole;
    }

    public String getNameRole() {
        return nameRole;
    }

    public void setNameRole(String nameRole) {
        this.nameRole = nameRole;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}
