package edu.bsuir.logistic.rest.model.statistics;

import edu.bsuir.logistic.rest.model.User;

/**
 * @author alku0916
 *         Date: 07.12.2016
 *         Time: 12:53
 */
public class UserStatistic {
    /**
     * The user to which the data
     *
     * @see #user
     */
    private User user;

    /**
     * The amount of payment for current User
     *
     * @see #amountOfPayments
     */
    private double amountOfPayments;

    /**
     * The count of payment for current User
     *
         * @see #countOfPayments
     */
    private double countOfPayments;

    public UserStatistic() {
    }

    /**
     * Constructor with params
     *
     * @param user
     * @param amountOfPayments
     * @param countOfPayments
     */
    public UserStatistic(User user, double amountOfPayments, double countOfPayments) {
        this.user = user;
        this.amountOfPayments = amountOfPayments;
        this.countOfPayments = countOfPayments;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getAmountOfPayments() {
        return amountOfPayments;
    }

    public void setAmountOfPayments(double amountOfPayments) {
        this.amountOfPayments = amountOfPayments;
    }

    public double getCountOfPayments() {
        return countOfPayments;
    }

    public void setCountOfPayments(double countOfPayments) {
        this.countOfPayments = countOfPayments;
    }
}