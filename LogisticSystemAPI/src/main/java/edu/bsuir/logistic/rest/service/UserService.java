package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.User;

import java.util.List;


public interface UserService {

    User findById(int id);

    User findByUsername(String username);

    boolean isUserExist(User user);

    void saveUser(User user);

    void updateUser(User user);

    void changePassword(User user);

    void deleteUserById(int id);

    void deleteAll();

    List<User> findAllUsers();

}