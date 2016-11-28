package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Goods;
import edu.bsuir.logistic.rest.model.Purchase;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.GoodsService;
import edu.bsuir.logistic.rest.service.PurchaseService;
import edu.bsuir.logistic.rest.service.UserService;
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

    @Autowired
    UserService userService;

    @Autowired
    GoodsService goodsService;

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

    //-------------------Retrieve All Confirmed Purchases--------------------------------------------------------

    @RequestMapping(value = "/rest/get/purchases/confirm", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Purchase>> listAllConfirmedPurchases() {
        List<Purchase> purchases = purchaseService.getAllConfirmed();
        if (purchases.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(purchases, HttpStatus.OK);
    }

    //-------------------Retrieve All Confirmed Purchases--------------------------------------------------------

    @RequestMapping(value = "/rest/get/purchases/noconfirm", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Purchase>> listAllUnconfirmedPurchases() {
        List<Purchase> purchases = purchaseService.getAllUnconfirmed();
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

    @RequestMapping(value = "/rest/create/purchase/{idClient}/{idGoods}", method = RequestMethod.POST)
    public ResponseEntity<Void> createPurchase(@PathVariable("idClient") int idClient, @PathVariable("idGoods") int
            idGoods, @RequestBody Purchase purchase, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating Purchase " + purchase.getIdPurchase());

        User client = userService.findById(idClient);
        Goods goods = goodsService.findById(idGoods);

        if (client == null || goods == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        purchase.setClient(client);
        purchase.setGoods(goods);
        purchaseService.savePurchase(purchase);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/purchase/{id}").buildAndExpand(purchase.getIdPurchase()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }


    //------------------- Update a Purchase --------------------------------------------------------

    @RequestMapping(value = "/rest/update/purchase/{id}/{newGoods}", method = RequestMethod.PUT)
    public ResponseEntity<Void> updatePurchase(@PathVariable("id") int id, @PathVariable("newGoods") int newGoods,
                                               @RequestBody Purchase purchase) {
        System.out.println("Updating Purchase " + id);

        Purchase currentPurchase = purchaseService.findById(id);

        if (currentPurchase == null) {
            LOGGER.debug("Purchase with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Goods goods = goodsService.findById(newGoods);

        if (goods != null) {
            currentPurchase.setGoods(goods);
        }

        currentPurchase.setQuantity(purchase.getQuantity());
        currentPurchase.setFrequency(purchase.getFrequency());

        purchaseService.updatePurchase(currentPurchase);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //------------------- Change status of confirmation ----------------------------------------------------------

    @RequestMapping(value = "/rest/update/purchase/{id}/confirm", method = RequestMethod.PUT)
    public ResponseEntity<Void> updatePurchase(@PathVariable("id") int id) {
        System.out.println("Updating Purchase " + id);

        Purchase currentPurchase = purchaseService.findById(id);

        if (currentPurchase == null) {
            LOGGER.debug("Purchase with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentPurchase.setConfirmed(true);

        purchaseService.updatePurchase(currentPurchase);
        return new ResponseEntity<>(HttpStatus.OK);
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
