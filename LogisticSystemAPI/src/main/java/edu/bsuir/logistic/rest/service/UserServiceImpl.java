package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.dao.UserDao;
import edu.bsuir.logistic.rest.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao dao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User findById(int id) {
        return dao.findById(id);
    }

    @Override
    public User findByUsername(String username) {
        return dao.findByUsername(username);
    }

    @Override
    public boolean isUserExist(User user) {
        return dao.findByUsername(user.getUsername()) != null;
    }

    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        dao.save(user);
    }

    public void updateUser(User user) {
        User entity = dao.findById(user.getIdUser());
        if (entity != null) {
            entity.setIdUser(user.getIdUser());
            if (!user.getPassword().equals(entity.getPassword())) {
                entity.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            entity.setRole(user.getRole());
            entity.setName(user.getName());
            entity.setEmail(user.getEmail());
            entity.setPhone(user.getPhone());
            entity.setAbout(user.getAbout());
        }
    }

    @Override
    public void deleteUserById(int id) {
        dao.deleteById(id);
    }

    @Override
    public void deleteAll() {
        dao.deleteAll();
    }

    public List<User> findAllUsers() {
        return dao.findAllUsers();
    }

}
