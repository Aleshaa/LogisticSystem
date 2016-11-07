package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.RoleDao;
import edu.bsuir.logistic.rest.model.Role;
import edu.bsuir.logistic.rest.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
@Service("roleService")
@Transactional
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleDao dao;

    @Override
    public Role findById(int id) {
        return dao.findById(id);
    }

    @Override
    public Role findByName(String name) {
        return dao.findByName(name);
    }

    @Override
    public List<Role> findAllRoles() {
        return dao.findAll();
    }
}
