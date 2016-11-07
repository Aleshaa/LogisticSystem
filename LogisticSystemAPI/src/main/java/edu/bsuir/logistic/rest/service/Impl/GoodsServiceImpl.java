package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.GoodsDao;
import edu.bsuir.logistic.rest.model.Goods;
import edu.bsuir.logistic.rest.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Service("goodsService")
@Transactional
public class GoodsServiceImpl implements GoodsService {

    @Autowired
    private GoodsDao dao;

    @Override
    public Goods findById(int id) {
        return dao.findById(id);
    }

    public void saveGoods(Goods goods) {
        dao.save(goods);
    }

    public void updateGoods(Goods goods) {
        Goods entity = dao.findById(goods.getIdGoods());
        if (entity != null) {
            entity = goods;
            dao.updateGoods(entity);
        }
    }

    @Override
    public void deleteGoodsById(int id) {
        dao.deleteById(id);
    }

    @Override
    public void deleteAll() {
        dao.deleteAll();
    }

    public List<Goods> findAll() {
        return dao.findAllGoods();
    }

}
