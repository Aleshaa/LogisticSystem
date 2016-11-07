package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.AddressDao;
import edu.bsuir.logistic.rest.model.Address;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
@Repository("addressDao")
public class AddressDaoImpl extends AbstractDao<Integer, Address> implements AddressDao {

    @Override
    public Address findById(Integer id) {
        Address address = getByKey(id);

        return address;
    }

    @Override
    public List<Address> findAllAddresses() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("idAddress"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<Address> addresses = (List<Address>) criteria.list();

        return addresses;
    }

    @Override
    public void save(Address address) {
        persist(address);
    }

    @Override
    public void updateAddress(Address address) {
        update(address);
    }

    @Override
    public void deleteById(Integer id) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("idAddress", id));
        Address address = (Address) crit.uniqueResult();
        delete(address);
    }

    @Override
    public void deleteAll() {
        String hql = "DELETE FROM Address";
        createQuery(hql).executeUpdate();
    }
}
