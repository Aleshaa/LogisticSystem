package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.User;

import java.util.List;


public interface UserDao {

    User findById(int id);

    void save(User user);

    void deleteById(String id);

    List<User> findAllUsers();

}

