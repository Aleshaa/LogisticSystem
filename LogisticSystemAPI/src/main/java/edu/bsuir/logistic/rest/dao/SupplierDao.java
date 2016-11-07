package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.Supplier;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface SupplierDao {

    Supplier findById(Integer id);

    List<Supplier> findAllSupplier();

    Supplier findByName(String name);

    void save(Supplier supplier);

    void updateSupplier(Supplier supplier);

    void deleteById(Integer id);

    void deleteAll();

}
