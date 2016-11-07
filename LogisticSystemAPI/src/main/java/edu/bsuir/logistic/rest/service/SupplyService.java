package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Supply;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
public interface SupplyService {

    Supply findById(int id);

    void saveSupply(Supply supply);

    void updateSupply(Supply supply);

    void deleteSupplyById(int id);

    void deleteAll();

    List<Supply> findAll();

}
