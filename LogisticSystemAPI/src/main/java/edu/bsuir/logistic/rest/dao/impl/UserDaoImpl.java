package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.UserDao;
import edu.bsuir.logistic.rest.model.User;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository("userDao")
public class UserDaoImpl extends AbstractDao<Integer, User> implements UserDao {

    private static final Logger LOGGER = Logger.getLogger(UserDaoImpl.class);

    public User findById(Integer id) {
        User user = getByKey(id);

        return user;
    }

    public User findByUsername(String username) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("username", username));
        return (User) crit.uniqueResult();
    }

    @SuppressWarnings("unchecked")
    public List<User> findAllUsers() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("name"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<User> users = (List<User>) criteria.list();

        return users;
    }

    public void save(User user) {
        persist(user);
    }

    public void updateUser(User user) {
        update(user);
    }

    @Override
    public void deleteById(Integer id) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("idUser", id));
        User user = (User) crit.uniqueResult();
        delete(user);
    }

    @Override
    public void deleteAll() {
        String hql = "DELETE FROM User";
        createQuery(hql).executeUpdate();
    }

}
