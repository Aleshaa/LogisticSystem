package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.AddressDao;
import edu.bsuir.logistic.rest.model.Address;
import edu.bsuir.logistic.rest.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@Service("addressService")
@Transactional
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressDao dao;

    @Override
    public Address findById(int id) {
        return dao.findById(id);
    }

    public void saveAddress(Address address) {
        dao.save(address);
    }

    public void updateAddress(Address address) {
        Address entity = dao.findById(address.getIdAddress());
        if (entity != null) {
            entity = address;
            dao.updateAddress(entity);
        }
    }

    @Override
    public void deleteAddressById(int id) {
        dao.deleteById(id);
    }

    @Override
    public void deleteAll() {
        dao.deleteAll();
    }

    public List<Address> findAll() {
        return dao.findAllAddresses();
    }

}

