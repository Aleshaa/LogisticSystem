package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.PurchaseDao;
import edu.bsuir.logistic.rest.model.Purchase;
import edu.bsuir.logistic.rest.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Service("purchaseService")
@Transactional
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseDao dao;

    @Override
    public Purchase findById(int id) {
        return dao.findById(id);
    }

    public void savePurchase(Purchase purchase) {
        dao.save(purchase);
    }

    public void updatePurchase(Purchase purchase) {
        Purchase entity = dao.findById(purchase.getIdPurchase());
        if (entity != null) {
            entity = purchase;
            dao.updatePurchase(entity);
        }
    }

    @Override
    public void deletePurchaseById(int id) {
        dao.deleteById(id);
    }

    @Override
    public void deleteAll() {
        dao.deleteAll();
    }

    public List<Purchase> findAll() {
        return dao.findAllPurchases();
    }

    @Override
    public List<Purchase> getAllConfirmed() {
        return dao.getConfirmedPurchases();
    }

    @Override
    public List<Purchase> getAllUnconfirmed() {
        return dao.getUnconfirmedPurchases();
    }

}
