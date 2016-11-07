package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Supplier;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.SupplierService;
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
public class SupplierController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    SupplierService supplierService;

    //-------------------Retrieve All Suppliers--------------------------------------------------------

    @RequestMapping(value = "/rest/get/suppliers", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Supplier>> listAllSuppliers() {
        List<Supplier> suppliers = supplierService.findAll();
        if (suppliers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(suppliers, HttpStatus.OK);
    }


    //-------------------Retrieve Single Supplier--------------------------------------------------------

    @RequestMapping(value = "/rest/get/supplier/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<Supplier> getSupplier(@PathVariable("id") int id) {
        System.out.println("Fetching Supplier with id " + id);
        Supplier supplier = supplierService.findById(id);
        if (supplier == null) {
            LOGGER.debug("Supplier with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(supplier, HttpStatus.OK);
    }


    //-------------------Create a Supplier--------------------------------------------------------

    @RequestMapping(value = "/rest/create/supplier", method = RequestMethod.POST)
    public ResponseEntity<Void> createSupplier(@RequestBody Supplier supplier, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating Supplier " + supplier.getIdSupplier());

        if (supplierService.findByName(supplier.getName()) != null) {
            LOGGER.debug("A Supplier with name " + supplier.getName() + " already exist");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        supplierService.saveSupplier(supplier);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/supplier/{id}").buildAndExpand(supplier.getIdSupplier()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }


    //------------------- Update a Supplier --------------------------------------------------------

    @RequestMapping(value = "/rest/update/supplier/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Supplier> updateSupplier(@PathVariable("id") int id, @RequestBody Supplier supplier) {
        System.out.println("Updating Supplier " + id);

        Supplier currentSupplier = supplierService.findById(id);

        if (currentSupplier == null) {
            LOGGER.debug("Supplier with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentSupplier.setName(supplier.getName());
        currentSupplier.setEmail(supplier.getEmail());
        currentSupplier.setPhone(supplier.getPhone());
        currentSupplier.setAbout(supplier.getAbout());

        supplierService.updateSupplier(currentSupplier);
        return new ResponseEntity<>(currentSupplier, HttpStatus.OK);
    }

    //------------------- Delete a Address --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/supplier/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Supplier> deleteSupplier(@PathVariable("id") int id) {
        System.out.println("Fetching & Deleting Supplier with id " + id);

        Supplier supplier = supplierService.findById(id);
        if (supplier == null) {
            LOGGER.debug("Unable to delete. Supplier with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        supplierService.deleteSupplierById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //------------------- Delete All Suppliers --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/suppliers", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteAllSuppliers() {
        System.out.println("Deleting All Suppliers");

        supplierService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
