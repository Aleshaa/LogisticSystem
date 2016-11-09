package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Role;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface RoleService {

    Role findById(int id);

    Role findByName(String name);

    List<Role> findAllRoles();

}
