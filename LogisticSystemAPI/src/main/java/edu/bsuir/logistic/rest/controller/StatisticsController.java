package edu.bsuir.logistic.rest.controller;

import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.model.Supply;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.model.statistics.GoodsStatistics;
import edu.bsuir.logistic.rest.model.statistics.UserStatistic;
import edu.bsuir.logistic.rest.service.BuyService;
import edu.bsuir.logistic.rest.service.StatisticsService;
import edu.bsuir.logistic.rest.service.SupplyService;
import edu.bsuir.logistic.rest.service.UserService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import static edu.bsuir.logistic.rest.model.RolesEnum.ADMIN;

/**
 * @author alku0916
 *         Date: 08.12.2016
 *         Time: 8:47
 */
@RestController
public class StatisticsController {

    private static final Logger LOGGER = Logger.getLogger(RoleController.class);

    @Autowired
    StatisticsService statisticsService;

    @Autowired
    UserService userService;

    @Autowired
    SupplyService supplyService;

    @Autowired
    BuyService buyService;

    /**
     * Get statistics for all users
     *
     * @return
     */
    @RequestMapping(value = "/rest/get/users/stat", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserStatistic>> getUsersStat() {
        List<UserStatistic> stats = statisticsService.getUsersStatistics();
        if (stats.isEmpty()) {
            LOGGER.info("Users statistics is empty");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    /**
     * Get statistics for current User
     *
     * @return
     */
    @RequestMapping(value = "/rest/get/user/stat", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<UserStatistic> getCurrentUserStat() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByUsername(name);
        UserStatistic stat = statisticsService.getUserStatistics(user);
        if (stat == null) {
            LOGGER.info("User statistic is empty");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(stat, HttpStatus.OK);
    }

    /**
     * Get Goods statistics
     *
     * @return
     */
    @RequestMapping(value = "/rest/get/goods/stat", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<GoodsStatistics>> getGoodsStat() {
        List<GoodsStatistics> stats = statisticsService.getGoodsStatistics();
        if (stats.isEmpty()) {
            LOGGER.info("Goods statistics is empty");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    /**
     * Get Goods statistics for current User
     *
     * @return
     */
    @RequestMapping(value = "/rest/get/goods/user/stat", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<GoodsStatistics>> getGoodsStatForCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByUsername(name);
        List<GoodsStatistics> stats = statisticsService.getGoodsStatisticsForCurrentUser(user);
        if (stats.isEmpty()) {
            LOGGER.info("Goods statistics is empty");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    /**
     * Get supply stat
     *
     * @return
     */
    @RequestMapping(value = "/rest/get/supply/stat", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Supply>> getSuppliesStat() {
        List<Supply> supplies = supplyService.findAll();
        if (supplies.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(supplies, HttpStatus.OK);
    }

    /**
     * Get buy stat
     *
     * @return
     */
    @RequestMapping(value = "/rest/get/buy/stat", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Buy>> getBuysStat() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByUsername(name);
        if (user.getRole().getIdRole().equals(ADMIN.getValue())) {
            List<Buy> allBuys = buyService.findAll();
            if (allBuys.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            return new ResponseEntity<>(allBuys, HttpStatus.OK);
        }
        List<Buy> listBuys = new ArrayList<>(user.getBuySet());
        if (listBuys.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(listBuys, HttpStatus.OK);
    }
}