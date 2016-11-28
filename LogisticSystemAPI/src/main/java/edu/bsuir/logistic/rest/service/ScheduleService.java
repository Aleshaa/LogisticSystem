package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.model.Purchase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.ParseException;
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
    public void demoServiceMethod() throws ParseException {

        // TODO: 28.11.2016 Check logic. Necessary to complete
        List<Purchase> purchaseList = purchaseService.findAll();
        List<Buy> buyList = buyService.findAll();
        for (Purchase purchase : purchaseList) {
            boolean flag = false;
            int lastDiffInDays = 1000;
            for (Buy buy : buyList) {
                Date buyDate = dateFormatAddition.parse(dateFormat.format(buy.getDate()));
                Date todayDate = dateFormatAddition.parse(dateFormat.format(new Date()));
                int diffInDays = (int) ((todayDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24));
                if (buy.getClient().getIdUser().equals(purchase.getClient().getIdUser()) &&
                        buy.getGoods().getIdGoods().equals(purchase.getGoods().getIdGoods()) && buy.isCompleted()) {
                    System.out.println("diffInDays = " + diffInDays);
                    if (diffInDays < lastDiffInDays)
                        lastDiffInDays = diffInDays;
                    flag = true;
                }
            }
            if (!flag || lastDiffInDays >= purchase.getFrequency()) {
                System.out.println("Ни разу не поставляли или просрочили поставку: тоже добавляем.");
            } else
                System.out.println("Еще не настало время");
        }
        System.out.println("Method executed at every 1 minutes. Current time is :: " + new Date());
    }

}
