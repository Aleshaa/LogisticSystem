package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.SupplierDao;
import edu.bsuir.logistic.rest.model.Supplier;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Repository("supplierDao")
public class SupplierDaoImpl extends AbstractDao<Integer, Supplier> implements SupplierDao {

    @Override
    public Supplier findById(Integer id) {
        return getByKey(id);
    }

    @Override
    public List<Supplier> findAllSupplier() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("idSupplier"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<Supplier> supplierList = (List<Supplier>) criteria.list();

        return supplierList;
    }

    @Override
    public Supplier findByName(String name) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("name", name));
        return (Supplier) crit.uniqueResult();
    }

    @Override
    public void save(Supplier supplier) {
        persist(supplier);
    }

    @Override
    public void updateSupplier(Supplier supplier) {
        update(supplier);
    }

    @Override
    public void deleteById(Integer id) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("idSupplier", id));
        Supplier supplier = (Supplier) crit.uniqueResult();
        delete(supplier);
    }

    @Override
    public void deleteAll() {
        String hql = "DELETE FROM Supplier";
        createQuery(hql).executeUpdate();
    }
}
