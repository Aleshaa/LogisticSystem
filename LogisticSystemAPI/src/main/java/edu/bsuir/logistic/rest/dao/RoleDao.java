package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.Role;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface RoleDao {

    Role findById(Integer id);

    Role findByName(String name);

    void save(Role role);

    void updateRole(Role role);

    void deleteById(Role role);

    void deleteAll();

    List<Role> findAll();
}
