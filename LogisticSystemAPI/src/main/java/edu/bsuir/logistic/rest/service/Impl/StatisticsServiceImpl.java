package edu.bsuir.logistic.rest.service.Impl;

import edu.bsuir.logistic.rest.dao.BuyDao;
import edu.bsuir.logistic.rest.dao.GoodsDao;
import edu.bsuir.logistic.rest.dao.UserDao;
import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.model.statistics.GoodsStatistics;
import edu.bsuir.logistic.rest.model.statistics.UserStatistic;
import edu.bsuir.logistic.rest.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private BuyDao buyDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GoodsDao goodsDao;

    @Override
    public List<UserStatistic> getUsersStatistics() {
        return null;
    }

    @Override
    public UserStatistic getUserStatisctics(User user) {
        return null;
    }

    @Override
    public List<GoodsStatistics> getGoodsStatistics() {
        return null;
    }

    @Override
    public List<GoodsStatistics> getGoodsStatisticsForCurrentUser(User user) {
        return null;
    }
}