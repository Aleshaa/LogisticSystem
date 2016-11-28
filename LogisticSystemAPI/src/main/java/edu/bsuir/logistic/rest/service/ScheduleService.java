package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.model.Purchase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service("scheduleService")
public class ScheduleService {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat dateFormatAddition = new SimpleDateFormat("yyyy-MM-dd");

    private final PurchaseService purchaseService;

    private final BuyService buyService;

    @Autowired
    public ScheduleService(PurchaseService purchaseService, BuyService buyService) {
        this.purchaseService = purchaseService;
        this.buyService = buyService;
    }

    @Scheduled(cron = "${cron.expression}")
    public void demoServiceMethod() {

        // TODO: 28.11.2016 Add logic
        List<Purchase> purchaseList = purchaseService.findAll();
        List<Buy> buyList = buyService.findAll();
        for (Purchase purchase : purchaseList)
            for (Buy buy : buyList) {
                String buyDateStr = dateFormat.format(buy.getDate());
                String todayDateStr = dateFormat.format(new Date());
            }
        System.out.println("Method executed at every 5 seconds. Current time is :: " + new Date());
    }

}
