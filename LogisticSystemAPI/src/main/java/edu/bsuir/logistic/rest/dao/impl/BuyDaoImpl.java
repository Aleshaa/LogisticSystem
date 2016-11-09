package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.BuyDao;
import edu.bsuir.logistic.rest.model.Buy;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Repository("buyDao")
public class BuyDaoImpl extends AbstractDao<Integer, Buy> implements BuyDao {

    @Override
    public Buy findById(Integer id) {
        return getByKey(id);
    }

    @Override
    public List<Buy> findAllBuys() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("idBuy"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<Buy> buyList = (List<Buy>) criteria.list();

        return buyList;
    }

    @Override
    public void save(Buy buy) {
        persist(buy);
    }

    @Override
    public void updateBuy(Buy buy) {
        update(buy);
    }

    @Override
    public void deleteById(Integer id) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("idBuy", id));
        Buy buy = (Buy) crit.uniqueResult();
        delete(buy);
    }

    @Override
    public void deleteAll() {
        String hql = "DELETE FROM Buy";
        createQuery(hql).executeUpdate();
    }
}
