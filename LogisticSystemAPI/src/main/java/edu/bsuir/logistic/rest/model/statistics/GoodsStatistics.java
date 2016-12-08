/*
 This software is the confidential information and copyrighted work of
 NetCracker Technology Corp. ("NetCracker") and/or its suppliers and
 is only distributed under the terms of a separate license agreement
 with NetCracker.
 Use of the software is governed by the terms of the license agreement.
 Any use of this software not in accordance with the license agreement
 is expressly prohibited by law, and may result in severe civil
 and criminal penalties. 
 
 Copyright (c) 1995-2016 NetCracker Technology Corp.
 
 All Rights Reserved.
 
*/
/*
 * Copyright 1995-2016 by NetCracker Technology Corp.,
 * University Office Park III
 * 95 Sawyer Road
 * Waltham, MA 02453
 * United States of America
 * All rights reserved.
 */
package edu.bsuir.logistic.rest.model.statistics;

import edu.bsuir.logistic.rest.model.Goods;

/**
 * @author alku0916
 *         Date: 07.12.2016
 *         Time: 12:53
 */
public class GoodsStatistics {
    /**
     * The goods to which the data
     *
     * @see #goods
     */
    private Goods goods;

    /**
     * Brought goods profits
     *
     * @see #broughtProfit
     */
    private double broughtProfit;

    /**
     * The number of purchases for current Goods
     *
     * @see #countOfPurchases
     */
    private double countOfPurchases;

    public GoodsStatistics() {
    }

    /**
     * Constructor with params
     *
     * @param goods
     * @param broughtProfit
     * @param countOfPurchases
     */
    public GoodsStatistics(Goods goods, double broughtProfit, double countOfPurchases) {
        this.goods = goods;
        this.broughtProfit = broughtProfit;
        this.countOfPurchases = countOfPurchases;
    }

    public Goods getGoods() {
        return goods;
    }

    public void setGoods(Goods goods) {
        this.goods = goods;
    }

    public double getBroughtProfit() {
        return broughtProfit;
    }

    public void setBroughtProfit(double broughtProfit) {
        this.broughtProfit = broughtProfit;
    }

    public double getCountOfPurchases() {
        return countOfPurchases;
    }

    public void setCountOfPurchases(double countOfPurchases) {
        this.countOfPurchases = countOfPurchases;
    }
}
/*
 WITHOUT LIMITING THE FOREGOING, COPYING, REPRODUCTION, REDISTRIBUTION,
 REVERSE ENGINEERING, DISASSEMBLY, DECOMPILATION OR MODIFICATION
 OF THE SOFTWARE IS EXPRESSLY PROHIBITED, UNLESS SUCH COPYING,
 REPRODUCTION, REDISTRIBUTION, REVERSE ENGINEERING, DISASSEMBLY,
 DECOMPILATION OR MODIFICATION IS EXPRESSLY PERMITTED BY THE LICENSE
 AGREEMENT WITH NETCRACKER. 
 
 THIS SOFTWARE IS WARRANTED, IF AT ALL, ONLY AS EXPRESSLY PROVIDED IN
 THE TERMS OF THE LICENSE AGREEMENT, EXCEPT AS WARRANTED IN THE
 LICENSE AGREEMENT, NETCRACKER HEREBY DISCLAIMS ALL WARRANTIES AND
 CONDITIONS WITH REGARD TO THE SOFTWARE, WHETHER EXPRESS, IMPLIED
 OR STATUTORY, INCLUDING WITHOUT LIMITATION ALL WARRANTIES AND
 CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
 TITLE AND NON-INFRINGEMENT.
 
 Copyright (c) 1995-2016 NetCracker Technology Corp.
 
 All Rights Reserved.
*/