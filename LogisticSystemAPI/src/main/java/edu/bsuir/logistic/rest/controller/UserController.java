package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.UserService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

/**
 * Created by Alesha on 02.11.2016.
 */
@RestController
public class UserController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    UserService userService;

    //-------------------Retrieve All Users--------------------------------------------------------

    @RequestMapping(value = "/rest/get/users", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> listAllUsers() {
        List<User> users = userService.findAllUsers();
        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


    //-------------------Retrieve Single User--------------------------------------------------------

    @RequestMapping(value = "/rest/get/user/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getUser(@PathVariable("id") int id) {
        System.out.println("Fetching User with id " + id);
        User user = userService.findById(id);
        if (user == null) {
            LOGGER.debug("User with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    //-------------------Create a User--------------------------------------------------------

    @RequestMapping(value = "/user", method = RequestMethod.POST)
    public ResponseEntity<Void> createUser(@RequestBody User user, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating User " + user.getName());

        if (userService.isUserExist(user)) {
            LOGGER.debug("A User with name " + user.getName() + " already exist");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        userService.saveUser(user);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/user/{id}").buildAndExpand(user.getIdUser()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }


    //------------------- Update a User --------------------------------------------------------

    @RequestMapping(value = "/rest/update/user/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Void> updateUser(@PathVariable("id") int id, @RequestBody User user) {
        System.out.println("Updating User " + id);

        User currentUser = userService.findById(id);

        if (currentUser == null) {
            LOGGER.debug("User with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentUser.setName(user.getName());
        currentUser.setAbout(user.getAbout());
        currentUser.setPhone(user.getPhone());
        currentUser.setEmail(user.getEmail());
        currentUser.setPassword(user.getPassword());

        userService.updateUser(currentUser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //------------------- Delete a User --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/user/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteUser(@PathVariable("id") int id) {
        System.out.println("Fetching & Deleting User with id " + id);

        User user = userService.findById(id);
        if (user == null) {
            LOGGER.debug("Unable to delete. User with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //------------------- Delete All Users --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/users", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteAllUsers() {
        System.out.println("Deleting All Users");

        userService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    //------------------- Authentication --------------------------------------------------------

    @RequestMapping(value = "/rest/authenticate", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<User> authenticate() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByUsername(name);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    //------------------- Get Current Login User --------------------------------------------------------

    @RequestMapping(value = "/rest/get/currentUser", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByUsername(name);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
