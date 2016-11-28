package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.model.Purchase;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface BuyDao {

    Buy findById(Integer id);

    List<Buy> findAllBuys();

    List<Buy> getCompletedBuys();

    List<Buy> getUncompletedBuys();

    void save(Buy buy);

    void updateBuy(Buy buy);

    void deleteById(Integer id);

    void deleteAll();

}
