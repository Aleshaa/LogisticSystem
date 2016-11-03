package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.User;

import java.util.List;


public interface UserDao {

    User findById(Integer id);

    User findByUsername(String username);

    void save(User user);

    void deleteById(Integer id);

    void deleteAll();

    List<User> findAllUsers();

}

