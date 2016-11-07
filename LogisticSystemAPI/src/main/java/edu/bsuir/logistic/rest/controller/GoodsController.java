package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Goods;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.service.GoodsService;
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
public class GoodsController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    GoodsService goodsService;

    //-------------------Retrieve All Goods--------------------------------------------------------

    @RequestMapping(value = "/rest/get/goods", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Goods>> listAllGoods() {
        List<Goods> goods = goodsService.findAll();
        if (goods.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(goods, HttpStatus.OK);
    }


    //-------------------Retrieve Single Goods--------------------------------------------------------

    @RequestMapping(value = "/rest/get/goods/{id}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<Goods> getGoods(@PathVariable("id") int id) {
        System.out.println("Fetching Goods with id " + id);
        Goods goods = goodsService.findById(id);
        if (goods == null) {
            LOGGER.debug("Goods with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(goods, HttpStatus.OK);
    }


    //-------------------Create a Goods--------------------------------------------------------

    @RequestMapping(value = "/rest/create/goods", method = RequestMethod.POST)
    public ResponseEntity<Void> createGoods(@RequestBody Goods goods, UriComponentsBuilder ucBuilder) {
        System.out.println("Creating Goods " + goods.getName());

        goodsService.saveGoods(goods);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/goods/{id}").buildAndExpand(goods.getIdGoods()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }


    //------------------- Update a Goods --------------------------------------------------------

    @RequestMapping(value = "/rest/update/goods/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Goods> updateGoods(@PathVariable("id") int id, @RequestBody Goods goods) {
        System.out.println("Updating Goods " + id);

        Goods currentGoods = goodsService.findById(id);

        if (currentGoods == null) {
            LOGGER.debug("Goods with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentGoods.setName(goods.getName());
        currentGoods.setQuantity(goods.getQuantity());
        currentGoods.setPrice(goods.getPrice());
        currentGoods.setAbout(goods.getAbout());

        goodsService.updateGoods(currentGoods);
        return new ResponseEntity<>(currentGoods, HttpStatus.OK);
    }

    //------------------- Delete a Goods --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/goods/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Goods> deleteGoods(@PathVariable("id") int id) {
        System.out.println("Fetching & Deleting Goods with id " + id);

        Goods goods = goodsService.findById(id);
        if (goods == null) {
            LOGGER.debug("Unable to delete. Goods with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        goodsService.deleteGoodsById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //------------------- Delete All Goods --------------------------------------------------------

    @RequestMapping(value = "/rest/delete/goods", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteAllGoods() {
        System.out.println("Deleting All Goods");

        goodsService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
