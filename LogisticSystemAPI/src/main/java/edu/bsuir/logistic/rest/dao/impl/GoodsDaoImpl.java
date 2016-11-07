package edu.bsuir.logistic.rest.dao.impl;

import edu.bsuir.logistic.rest.dao.AbstractDao;
import edu.bsuir.logistic.rest.dao.GoodsDao;
import edu.bsuir.logistic.rest.model.Goods;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Repository("goodsDao")
public class GoodsDaoImpl extends AbstractDao<Integer, Goods> implements GoodsDao {

    @Override
    public Goods findById(Integer id) {
        return getByKey(id);
    }

    @Override
    public List<Goods> findAllGoods() {
        Criteria criteria = createEntityCriteria().addOrder(Order.asc("idGoods"));
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);//To avoid duplicates.
        List<Goods> goodsList = (List<Goods>) criteria.list();

        return goodsList;
    }

    @Override
    public void save(Goods goods) {
        persist(goods);
    }

    @Override
    public void updateGoods(Goods goods) {
        update(goods);
    }

    @Override
    public void deleteById(Integer id) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("idGoods", id));
        Goods goods = (Goods) crit.uniqueResult();
        delete(goods);
    }

    @Override
    public void deleteAll() {
        String hql = "DELETE FROM Goods";
        createQuery(hql).executeUpdate();
    }
}
