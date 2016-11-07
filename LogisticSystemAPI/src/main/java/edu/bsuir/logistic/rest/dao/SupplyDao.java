package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.Supply;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface SupplyDao {

    Supply findById(Integer id);

    List<Supply> findAllSupplys();

    void save(Supply supply);

    void updateSupply(Supply supply);

    void deleteById(Integer id);

    void deleteAll();
}
