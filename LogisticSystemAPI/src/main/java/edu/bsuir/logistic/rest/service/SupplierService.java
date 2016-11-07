package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Supplier;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
public interface SupplierService {

    Supplier findById(int id);

    Supplier findByName(String name);

    void saveSupplier(Supplier supplier);

    void updateSupplier(Supplier supplier);

    void deleteSupplierById(int id);

    void deleteAll();

    List<Supplier> findAll();

}
