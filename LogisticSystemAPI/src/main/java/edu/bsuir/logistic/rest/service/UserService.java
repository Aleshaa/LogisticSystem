package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.User;

import java.util.List;


public interface UserService {

    User findById(int id);

    void saveUser(User user);

    void updateUser(User user);

    void deleteUserById(String id);

    List<User> findAllUsers();

}