package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Address;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.AddressService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

/**
 * Created by Alesha on 07.11.2016.
 */
@RestController
public class AddressController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    AddressService addressService;

    //-------------------Retrieve All Addresses--------------------------------------------------------

    @RequestMapping(value = "/rest/get/addresses", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Address>> listAllAddresses() {
        List<Address> addresses = addressService.findAll();
        if (addresses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }


    //-------------------Retrieve Single Address--------------------------------------------------------

    @RequestMapping(value = "/rest/get/address/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<Address> getAddress(@PathVariable("id") int id) {
        System.out.println("Fetching Address with id " + id);
        Address address = addressService.findById(id);
        if (address == null) {
            LOGGER.debug("Address with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(address, HttpStatus.OK);
    }


    //-------------------Create a Address--------------------------------------------------------

    @RequestMapping(value = "/address", method = RequestMethod.POST)
    public ResponseEntity<Void> createAddress(@RequestBody Address address, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating Address " + address.getCity() + " " + address.getStreet() + " "
                + address.getNumber());

        addressService.saveAddress(address);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/address/{id}").buildAndExpand(address.getIdAddress()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }


    //------------------- Update a Address --------------------------------------------------------

    @RequestMapping(value = "/rest/update/address/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Address> updateAddress(@PathVariable("id") int id, @RequestBody Address address) {
        System.out.println("Updating Address " + id);

        Address currentAddress = addressService.findById(id);

        if (currentAddress == null) {
            LOGGER.debug("Address with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentAddress.setCountry(address.getCountry());
        currentAddress.setCity(address.getCity());
        currentAddress.setStreet(address.getStreet());
        currentAddress.setNumber(address.getNumber());

        addressService.updateAddress(currentAddress);
        return new ResponseEntity<>(currentAddress, HttpStatus.OK);
    }

    //------------------- Delete a Address --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/address/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Address> deleteAddress(@PathVariable("id") int id) {
        System.out.println("Fetching & Deleting Address with id " + id);

        Address address = addressService.findById(id);
        if (address == null) {
            LOGGER.debug("Unable to delete. Address with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        addressService.deleteAddressById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //------------------- Delete All Addresses --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/addresses", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteAllAddresses() {
        System.out.println("Deleting All Addresses");

        addressService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
