package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.BuyDao;
import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.service.BuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Service("buyService")
@Transactional
public class BuyServiceImpl implements BuyService {

    @Autowired
    private BuyDao dao;

    @Override
    public Buy findById(int id) {
        return dao.findById(id);
    }

    public void saveBuy(Buy buy) {
        dao.save(buy);
    }

    public void updateBuy(Buy buy) {
        Buy entity = dao.findById(buy.getIdBuy());
        if (entity != null) {
            entity = buy;
            dao.updateBuy(entity);
        }
    }

    @Override
    public void deleteBuyById(int id) {
        dao.deleteById(id);
    }

    @Override
    public void deleteAll() {
        dao.deleteAll();
    }

    public List<Buy> findAll() {
        return dao.findAllBuys();
    }

    @Override
    public List<Buy> getCompleted() {
        return dao.getCompletedBuys();
    }

    @Override
    public List<Buy> getDisabled() {
        return dao.getUncompletedBuys();
    }

}
