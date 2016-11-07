package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Buy;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
public interface BuyService {

    Buy findById(int id);

    void saveBuy(Buy buy);

    void updateBuy(Buy buy);

    void deleteBuyById(int id);

    void deleteAll();

    List<Buy> findAll();
}
