package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.Goods;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface GoodsDao {

    Goods findById(Integer id);

    List<Goods> findAllGoods();

    void save(Goods goods);

    void updateGoods(Goods goods);

    void deleteById(Integer id);

    void deleteAll();

}
