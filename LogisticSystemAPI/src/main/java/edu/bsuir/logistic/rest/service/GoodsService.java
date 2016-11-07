package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Goods;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
public interface GoodsService {

    Goods findById(int id);

    void saveGoods(Goods goods);

    void updateGoods(Goods goods);

    void deleteGoodsById(int id);

    void deleteAll();

    List<Goods> findAll();
}
