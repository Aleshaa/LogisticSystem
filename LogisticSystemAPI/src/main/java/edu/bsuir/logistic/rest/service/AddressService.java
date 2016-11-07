package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Address;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
public interface AddressService {

    Address findById(int id);

    void saveAddress(Address address);

    void updateAddress(Address address);

    void deleteAddressById(int id);

    void deleteAll();

    List<Address> findAll();
}
