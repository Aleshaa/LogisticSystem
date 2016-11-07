package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.PurchaseDao;
import edu.bsuir.logistic.rest.model.Purchase;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Repository("purchaseDao")
public class PurchaseDaoImpl extends AbstractDao<Integer, Purchase> implements PurchaseDao {

    @Override
    public Purchase findById(Integer id) {
        return getByKey(id);
    }

    @Override
    public List<Purchase> findAllPurchases() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("idPurchase"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<Purchase> purchaseList = (List<Purchase>) criteria.list();

        return purchaseList;
    }

    @Override
    public void save(Purchase purchase) {
        persist(purchase);
    }

    @Override
    public void updatePurchase(Purchase purchase) {
        update(purchase);
    }

    @Override
    public void deleteById(Integer id) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("idPurchase", id));
        Purchase purchase = (Purchase) crit.uniqueResult();
        delete(purchase);
    }

    @Override
    public void deleteAll() {
        String hql = "DELETE FROM Purchase";
        createQuery(hql).executeUpdate();
    }
}
