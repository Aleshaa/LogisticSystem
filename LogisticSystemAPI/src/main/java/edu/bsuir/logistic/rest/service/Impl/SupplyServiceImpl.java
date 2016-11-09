package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.SupplyDao;
import edu.bsuir.logistic.rest.model.Supply;
import edu.bsuir.logistic.rest.service.SupplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Service("supplyService")
@Transactional
public class SupplyServiceImpl implements SupplyService {

    @Autowired
    private SupplyDao dao;

    @Override
    public Supply findById(int id) {
        return dao.findById(id);
    }

    public void saveSupply(Supply supply) {
        dao.save(supply);
    }

    public void updateSupply(Supply supply) {
        Supply entity = dao.findById(supply.getIdSupply());
        if (entity != null) {
            entity = supply;
            dao.updateSupply(entity);
        }
    }

    @Override
    public void deleteSupplyById(int id) {
        dao.deleteById(id);
    }

    @Override
    public void deleteAll() {
        dao.deleteAll();
    }

    public List<Supply> findAll() {
        return dao.findAllSupplys();
    }

}
