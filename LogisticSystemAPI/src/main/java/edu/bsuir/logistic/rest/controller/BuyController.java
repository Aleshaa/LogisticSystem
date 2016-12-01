package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.model.Goods;
import edu.bsuir.logistic.rest.model.Purchase;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.BuyService;
import edu.bsuir.logistic.rest.service.GoodsService;
import edu.bsuir.logistic.rest.service.PurchaseService;
import edu.bsuir.logistic.rest.service.UserService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Created by Alesha on 07.11.2016.
 */
@RestController
public class BuyController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    BuyService buyService;

    @Autowired
    UserService userService;

    @Autowired
    GoodsService goodsService;

    @Autowired
    PurchaseService purchaseService;

    //-------------------Retrieve All Buys--------------------------------------------------------

    @RequestMapping(value = "/rest/get/buys", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Buy>> listAllBuys() {
        List<Buy> buys = buyService.findAll();
        if (buys.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(buys, HttpStatus.OK);
    }

    //-------------------Retrieve All Completed Buys--------------------------------------------------------

    @RequestMapping(value = "/rest/get/buys/completed", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Buy>> listAllCompletedBuys() {
        List<Buy> buys = buyService.getCompleted();
        if (buys.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(buys, HttpStatus.OK);
    }

    //-------------------Retrieve All Completed Buys For Current Client-------------------------------------------

    @RequestMapping(value = "/rest/get/buys/completed/user", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Buy>> getCompletedBuysForCurrentClient() {
        List<Buy> listBuys = new ArrayList<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByUsername(name);
        Set<Buy> buySet = user.getBuySet();
        if (buySet.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        for (Buy buy : buySet) {
            if (buy.isCompleted())
                listBuys.add(buy);
        }
        if (listBuys.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(listBuys, HttpStatus.OK);
    }

    //-------------------Retrieve All Disabled Buys--------------------------------------------------------

    @RequestMapping(value = "/rest/get/buys/nocompleted", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Buy>> listAllDisabledBuys() {
        List<Buy> buys = buyService.getDisabled();
        if (buys.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(buys, HttpStatus.OK);
    }

    //-------------------Retrieve All No Completed Buys For Current Client-------------------------------------------

    @RequestMapping(value = "/rest/get/buys/nocompleted/user", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Buy>> getNoCompletedBuysForCurrentClient() {
        List<Buy> listBuys = new ArrayList<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByUsername(name);
        Set<Buy> buySet = user.getBuySet();
        if (buySet.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        for (Buy buy : buySet) {
            if (!buy.isCompleted())
                listBuys.add(buy);
        }
        if (listBuys.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(listBuys, HttpStatus.OK);
    }

    //-------------------Retrieve Single Buy--------------------------------------------------------

    @RequestMapping(value = "/rest/get/buy/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<Buy> getBuy(@PathVariable("id") int id) {
        System.out.println("Fetching Buy with id " + id);
        Buy buy = buyService.findById(id);
        if (buy == null) {
            LOGGER.debug("Buy with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(buy, HttpStatus.OK);
    }


    //-------------------Create a Buy--------------------------------------------------------

    @RequestMapping(value = "/rest/create/buy/{idClient}/{idGoods}", method = RequestMethod.POST)
    public ResponseEntity<Void> createBuy(@PathVariable("idClient") int idClient,
                                          @PathVariable("idGoods") int idGoods,
                                          @RequestBody Buy buy, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating Buy " + buy.getIdBuy());

        Goods buyedGoods = goodsService.findById(idGoods);
        if (buyedGoods.getQuantity() - buy.getQuantity() >= 0) {
            buy.setClient(userService.findById(idClient));
            buy.setGoods(buyedGoods);
            buyService.saveBuy(buy);

            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ucBuilder.path("/buy/{id}").buildAndExpand(buy.getIdBuy()).toUri());
            return new ResponseEntity<>(headers, HttpStatus.CREATED);
        } else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    //------------------- Update a Buy --------------------------------------------------------

    @RequestMapping(value = "/rest/update/buy/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Void> updateBuy(@PathVariable("id") int id, @RequestBody Buy buy) {
        System.out.println("Updating Buy " + id);

        Buy currentBuy = buyService.findById(id);

        if (currentBuy == null) {
            LOGGER.debug("Buy with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (currentBuy.getGoods().getQuantity() + currentBuy.getQuantity() - buy.getQuantity() >= 0) {
            Goods currentGoods = currentBuy.getGoods();
            currentGoods.setQuantity(currentBuy.getGoods().getQuantity() + currentBuy.getQuantity() - buy.getQuantity
                    ());

            currentBuy.setQuantity(buy.getQuantity());
            buyService.updateBuy(currentBuy);

            goodsService.updateGoods(currentGoods);

            return new ResponseEntity<>(HttpStatus.OK);
        } else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    //------------------- Proof of buy is complete --------------------------------------------------------

    @RequestMapping(value = "/rest/update/buy/{id}/complete", method = RequestMethod.PUT)
    public ResponseEntity<Void> updateBuy(@PathVariable("id") int id) {
        System.out.println("Updating Buy " + id);

        Buy currentBuy = buyService.findById(id);

        if (currentBuy == null) {
            LOGGER.debug("Buy with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Goods buyedGoods = goodsService.findById(currentBuy.getGoods().getIdGoods());
        if (buyedGoods.getQuantity() - currentBuy.getQuantity() >= 0) {
            buyedGoods.setQuantity(buyedGoods.getQuantity() - currentBuy.getQuantity());
            goodsService.updateGoods(buyedGoods);

            currentBuy.setCompleted(true);
            buyService.updateBuy(currentBuy);

            if (buyedGoods.getQuantity() - currentBuy.getQuantity() == 0) {
                List<Purchase> purchaseList = purchaseService.getAllConfirmed();
                for (Purchase purchase : purchaseList) {
                    if (purchase.getClient().getIdUser().equals(currentBuy.getClient().getIdUser()) &&
                    purchase.getGoods().getIdGoods().equals(currentBuy.getGoods().getIdGoods())) {
                        purchase.setConfirmed(false);
                        purchaseService.updatePurchase(purchase);
                    }
                }
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    //------------------- Delete a Buy --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/buy/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Buy> deleteBuy(@PathVariable("id") int id) {
        System.out.println("Fetching & Deleting Buy with id " + id);

        Buy buy = buyService.findById(id);
        if (buy == null) {
            LOGGER.debug("Unable to delete. Buy with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        buyService.deleteBuyById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //------------------- Delete All Buys --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/buys", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteAllBuys() {
        System.out.println("Deleting All Buys");

        buyService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
