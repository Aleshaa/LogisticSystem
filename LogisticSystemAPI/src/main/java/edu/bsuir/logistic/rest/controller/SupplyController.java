package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Supply;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.SupplyService;
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
public class SupplyController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    SupplyService supplyService;

    //-------------------Retrieve All Supplies--------------------------------------------------------

    @RequestMapping(value = "/rest/get/supplies", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Supply>> listAllSupplies() {
        List<Supply> supplies = supplyService.findAll();
        if (supplies.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(supplies, HttpStatus.OK);
    }


    //-------------------Retrieve Single Supply--------------------------------------------------------

    @RequestMapping(value = "/rest/get/supply/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<Supply> getSupply(@PathVariable("id") int id) {
        System.out.println("Fetching Supply with id " + id);
        Supply supply = supplyService.findById(id);
        if (supply == null) {
            LOGGER.debug("Supply with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(supply, HttpStatus.OK);
    }


    //-------------------Create a Supply--------------------------------------------------------

    @RequestMapping(value = "/rest/create/supply", method = RequestMethod.POST)
    public ResponseEntity<Void> createSupply(@RequestBody Supply supply, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating Supply " + supply.getIdSupply());

        supplyService.saveSupply(supply);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/supply/{id}").buildAndExpand(supply.getIdSupply()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }


    //------------------- Update a Supply --------------------------------------------------------

    @RequestMapping(value = "/rest/update/supply/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Void> updateSupply(@PathVariable("id") int id, @RequestBody Supply supply) {
        System.out.println("Updating Supply " + id);

        Supply currentSupply = supplyService.findById(id);

        if (currentSupply == null) {
            LOGGER.debug("Supply with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentSupply.setQuantity(supply.getQuantity());

        supplyService.updateSupply(currentSupply);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //------------------- Delete a Supplies --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/supply/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Supply> deleteSupply(@PathVariable("id") int id) {
        System.out.println("Fetching & Deleting Supply with id " + id);

        Supply supply = supplyService.findById(id);
        if (supply == null) {
            LOGGER.debug("Unable to delete. Supply with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        supplyService.deleteSupplyById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //------------------- Delete All Supplies --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/supplies", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteAllSupplies() {
        System.out.println("Deleting All Supplies");

        supplyService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

