package edu.bsuir.logistic.rest.dao;

import edu.bsuir.logistic.rest.model.Address;

import java.util.List;

/**
 * Created by Alesha on 06.11.2016.
 */
public interface AddressDao {

    Address findById(Integer id);

    List<Address> findAllAddresses();

    void save(Address address);

    void updateAddress(Address address);

    void deleteById(Integer id);

    void deleteAll();

}
