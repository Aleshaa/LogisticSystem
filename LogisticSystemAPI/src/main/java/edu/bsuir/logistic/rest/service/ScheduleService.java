package edu.bsuir.logistic.rest.service;

import edu.bsuir.logistic.rest.model.Buy;
import edu.bsuir.logistic.rest.model.Purchase;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service("scheduleService")
public class ScheduleService {

    private static final Logger LOGGER = Logger.getLogger(ScheduleService.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat dateFormatAddition = new SimpleDateFormat("yyyy-MM-dd");

    private final PurchaseService purchaseService;

    private final BuyService buyService;

    private final GoodsService goodsService;

    @Autowired
    public ScheduleService(PurchaseService purchaseService, BuyService buyService, GoodsService goodsService) {
        this.purchaseService = purchaseService;
        this.buyService = buyService;
        this.goodsService = goodsService;
    }

    /**
     * Check condition of purchases and save buys if is necessary
     * @throws ParseException
     */
    @Scheduled(cron = "${cron.expression}")
    public void saveBuyForPurchase() throws ParseException {

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
                    if (diffInDays < lastDiffInDays)
                        lastDiffInDays = diffInDays;
                    flag = true;
                }
            }
            if (purchase.isConfirmed() && (!flag || lastDiffInDays >= purchase.getFrequency())) {
                Buy buy = new Buy();
                buy.setClient(purchase.getClient());
                buy.setDate(dateFormatAddition.parse(dateFormat.format(new Date())));
                buy.setGoods(purchase.getGoods());
                buy.setQuantity(purchase.getQuantity());
                buyService.saveBuy(buy);
                LOGGER.info("Ни разу не поставляли/просрочили поставку/нужное время: добавляем.");
            } else
                LOGGER.info("Еще не настало время");
        }
        LOGGER.info("Method executed at every 10 minutes. Current time is :: " + new Date());
    }

}
