package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.SupplyDao;
import edu.bsuir.logistic.rest.model.Supply;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Repository("supplyDao")
public class SupplyDaoImpl extends AbstractDao<Integer, Supply> implements SupplyDao {

    @Override
    public Supply findById(Integer id) {
        return getByKey(id);
    }

    @Override
    public List<Supply> findAllSupplys() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("idSupply"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<Supply> supplyList = (List<Supply>) criteria.list();

        return supplyList;
    }

    @Override
    public void save(Supply supply) {
        persist(supply);
    }

    @Override
    public void updateSupply(Supply supply) {
        update(supply);
    }

    @Override
    public void deleteById(Integer id) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("idSupply", id));
        Supply supply = (Supply) crit.uniqueResult();
        delete(supply);
    }

    @Override
    public void deleteAll() {
        String hql = "DELETE FROM Supply";
        createQuery(hql).executeUpdate();
    }
}

