package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.GoodsDao;
import edu.bsuir.logistic.rest.dao.RoleDao;
import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.model.Goods;
import edu.bsuir.logistic.rest.model.Role;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.model.statistics.GoodsStatistics;
import edu.bsuir.logistic.rest.model.statistics.UserStatistic;
import edu.bsuir.logistic.rest.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @author alku0916
 *         Date: 07.12.2016
 *         Time: 13:16
 */
@Service("statisticService")
@Transactional
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private GoodsDao goodsDao;

    @Autowired
    private RoleDao roleDao;

    @Override
    public List<UserStatistic> getUsersStatistics() {
        Role role = roleDao.findById(2);
        List<UserStatistic> usersStat = new ArrayList<>();
        List<User> users = new ArrayList<>();

        users.addAll(role.getUsers());

        for (User user : users) {
            UserStatistic userStat = new UserStatistic();
            List<Buy> userBuys = new ArrayList<>(user.getBuySet());
            int amountOfPayment = 0;

            for (Buy buy : userBuys) {
                amountOfPayment += buy.getQuantity() * buy.getGoods().getPrice();
            }

            userStat.setCountOfPayments(userBuys.size());
            userStat.setAmountOfPayments(amountOfPayment);
            usersStat.add(userStat);
        }
        return usersStat;
    }

    @Override
    public UserStatistic getUserStatistics(User user) {
        UserStatistic userStat = new UserStatistic();
        List<Buy> userBuys = new ArrayList<>(user.getBuySet());
        int amountOfPayment = 0;

        for (Buy buy : userBuys) {
            amountOfPayment += buy.getQuantity() * buy.getGoods().getPrice();
        }

        userStat.setCountOfPayments(userBuys.size());
        userStat.setAmountOfPayments(amountOfPayment);
        return userStat;
    }

    @Override
    public List<GoodsStatistics> getGoodsStatistics() {
        List<Goods> goodsList = goodsDao.findAllGoods();
        List<GoodsStatistics> goodsStats = new ArrayList<>();

        for (Goods goods : goodsList) {
            GoodsStatistics goodsStat = new GoodsStatistics();
            List<Buy> buyList = new ArrayList<>(goods.getBuySet());
            int profit = 0;
            for (Buy buy : buyList) {
                profit += buy.getQuantity() * goods.getPrice();
            }
            goodsStat.setBroughtProfit(profit);
            goodsStat.setCountOfPurchases(buyList.size());
            goodsStats.add(goodsStat);
        }

        return goodsStats;
    }

    @Override
    public List<GoodsStatistics> getGoodsStatisticsForCurrentUser(User user) {
        List<Goods> goodsList = goodsDao.findAllGoods();
        List<GoodsStatistics> goodsStats = new ArrayList<>();

        for (Goods goods : goodsList) {
            GoodsStatistics goodsStat = new GoodsStatistics();
            List<Buy> buyList = new ArrayList<>(goods.getBuySet());
            int profit = 0;
            int count = 0;
            for (Buy buy : buyList) {
                if (user.getIdUser().equals(buy.getClient().getIdUser())) {
                    profit += buy.getQuantity() * goods.getPrice();
                    count++;
                }
            }
            goodsStat.setBroughtProfit(profit);
            goodsStat.setCountOfPurchases(count);
            goodsStats.add(goodsStat);
        }

        return goodsStats;
    }
}