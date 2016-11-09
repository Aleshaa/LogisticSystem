package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.Purchase;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface PurchaseDao {

    Purchase findById(Integer id);

    List<Purchase> findAllPurchases();

    void save(Purchase purchase);

    void updatePurchase(Purchase purchase);

    void deleteById(Integer id);

    void deleteAll();
}
