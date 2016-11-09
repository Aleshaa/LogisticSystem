package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Role;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.RoleService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
@RestController
public class RoleController {

    private static final Logger LOGGER = Logger.getLogger(RoleController.class);

    @Autowired
    RoleService roleService;

    //-------------------Retrieve All Roles--------------------------------------------------------

    @RequestMapping(value = "/rest/get/roles", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Role>> listAllRoles() {
        List<Role> roles = roleService.findAllRoles();
        if (roles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    //-------------------Retrieve All Users by Role "USER"--------------------------------------------------

    @RequestMapping(value = "/rest/get/role/users", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> listAllUsers() {
        Role role = roleService.findById(2);

        List<User> users = new ArrayList<>();
        users.addAll(role.getUsers());
        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    //-------------------Retrieve Single Role--------------------------------------------------------

    @RequestMapping(value = "/rest/get/role/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<Role> getRole(@PathVariable("id") int id) {
        System.out.println("Fetching Role with id " + id);
        Role role = roleService.findById(id);
        if (role == null) {
            LOGGER.debug("Role with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(role, HttpStatus.OK);
    }

}
