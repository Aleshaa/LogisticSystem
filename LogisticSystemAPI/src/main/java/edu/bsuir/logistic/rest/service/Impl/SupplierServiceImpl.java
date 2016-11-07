package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.SupplierDao;
import edu.bsuir.logistic.rest.model.Supplier;
import edu.bsuir.logistic.rest.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Service("supplierService")
@Transactional
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierDao dao;

    @Override
    public Supplier findById(int id) {
        return dao.findById(id);
    }

    @Override
    public Supplier findByName(String name) {
        return dao.findByName(name);
    }

    public void saveSupplier(Supplier supplier) {
        dao.save(supplier);
    }

    public void updateSupplier(Supplier supplier) {
        Supplier entity = dao.findById(supplier.getIdSupplier());
        if (entity != null) {
            entity = supplier;
            dao.updateSupplier(entity);
        }
    }

    @Override
    public void deleteSupplierById(int id) {
        dao.deleteById(id);
    }

    @Override
    public void deleteAll() {
        dao.deleteAll();
    }

    public List<Supplier> findAll() {
        return dao.findAllSupplier();
    }

}
