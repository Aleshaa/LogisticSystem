package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.RoleDao;
import edu.bsuir.logistic.rest.model.Role;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
@Repository("roleDao")

public class RoleDaoImpl extends AbstractDao<Integer, Role> implements RoleDao {

    @Override
    public Role findById(Integer id) {
        Role role = getByKey(id);

        return role;
    }

    @Override
    public Role findByName(String name) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("NameRole", name));
        return (Role) crit.uniqueResult();
    }

    @Override
    public void save(Role role) {

    }

    @Override
    public void updateRole(Role role) {

    }

    @Override
    public void deleteById(Role role) {

    }

    @Override
    public void deleteAll() {

    }

    @Override
    public List<Role> findAll() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("idRole"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<Role> roles = (List<Role>) criteria.list();

        return roles;
    }
}
