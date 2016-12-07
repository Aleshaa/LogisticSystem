package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.User;
import edu.bsuir.logistic.rest.model.statistics.GoodsStatistics;
import edu.bsuir.logistic.rest.model.statistics.UserStatistic;

import java.util.List;

/**
 * @author alku0916
 *         Date: 07.12.2016
 *         Time: 13:12
 */
public interface StatisticsService {

    List<UserStatistic> getUsersStatistics();

    UserStatistic getUserStatisctics(User user);

    List<GoodsStatistics> getGoodsStatistics();

    List<GoodsStatistics> getGoodsStatisticsForCurrentUser(User user);
}
