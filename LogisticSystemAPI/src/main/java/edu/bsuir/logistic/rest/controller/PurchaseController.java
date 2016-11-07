package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Purchase;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.PurchaseService;
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
public class PurchaseController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    PurchaseService purchaseService;

    //-------------------Retrieve All Purchases--------------------------------------------------------

    @RequestMapping(value = "/rest/get/purchases", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Purchase>> listAllPurchases() {
        List<Purchase> purchases = purchaseService.findAll();
        if (purchases.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(purchases, HttpStatus.OK);
    }


    //-------------------Retrieve Single Purchase--------------------------------------------------------

    @RequestMapping(value = "/rest/get/purchase/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<Purchase> getPurchase(@PathVariable("id") int id) {
        System.out.println("Fetching Purchase with id " + id);
        Purchase purchase = purchaseService.findById(id);
        if (purchase == null) {
            LOGGER.debug("Purchase with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(purchase, HttpStatus.OK);
    }


    //-------------------Create a Purchase--------------------------------------------------------

    @RequestMapping(value = "/rest/create/purchase", method = RequestMethod.POST)
    public ResponseEntity<Void> createPurchase(@RequestBody Purchase purchase, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating Purchase " + purchase.getIdPurchase());

        purchaseService.savePurchase(purchase);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/purchase/{id}").buildAndExpand(purchase.getIdPurchase()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }


    //------------------- Update a Purchase --------------------------------------------------------

    @RequestMapping(value = "/rest/update/purchase/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Purchase> updatePurchase(@PathVariable("id") int id, @RequestBody Purchase purchase) {
        System.out.println("Updating Purchase " + id);

        Purchase currentPurchase = purchaseService.findById(id);

        if (currentPurchase == null) {
            LOGGER.debug("Purchase with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentPurchase.setQuantity(purchase.getQuantity());

        purchaseService.updatePurchase(currentPurchase);
        return new ResponseEntity<>(currentPurchase, HttpStatus.OK);
    }

    //------------------- Delete a Address --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/purchase/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Purchase> deletePurchase(@PathVariable("id") int id) {
        System.out.println("Fetching & Deleting Purchase with id " + id);

        Purchase purchase = purchaseService.findById(id);
        if (purchase == null) {
            LOGGER.debug("Unable to delete. Purchase with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        purchaseService.deletePurchaseById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //------------------- Delete All Purchases --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/purchases", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteAllPurchases() {
        System.out.println("Deleting All Purchases");

        purchaseService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
