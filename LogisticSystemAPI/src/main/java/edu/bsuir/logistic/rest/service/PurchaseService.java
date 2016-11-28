package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Purchase;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
public interface PurchaseService {

    Purchase findById(int id);

    void savePurchase(Purchase purchase);

    void updatePurchase(Purchase purchase);

    void deletePurchaseById(int id);

    void deleteAll();

    List<Purchase> findAll();

    List<Purchase> getAllConfirmed();

    List<Purchase> getAllUnconfirmed();

}
