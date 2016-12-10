USE `logistic`;

INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (1, 'ADMIN');
INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (2, 'USER');

INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (1, 1, 'Admin', 'kurganovich.aa@gmail.com', '80296993172', 'Administrator', 'admin',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (2, 2, 'Danone', 'danone@gmail.com', '80296993173', 'Крупнейшая компания данон', 'danone',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (3, 2, 'Лидское пиво', 'lidskoe@gmail.com', '80296993174', 'Крупенейший производитель пива в Беларуси', 'user',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (4, 2, 'President', 'president@gmail.com', '80296993175', 'Магазины сыров', 'president',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (5, 2, 'Heinz', 'heinz@gmail.com', '80296993176',
        'Компания Heinz - один из крупнейших производителей продуктов питания в мире ', 'heinz',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');

INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (1, 2, "Беларусь", "Минск", "Плеханова", 46);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (2, 2, "Беларусь", "Минск", "Плеханова", 47);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (3, 3, "Беларусь", "Минск", "Горовца", 33);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (4, 1, "Беларусь", "Минск", "Володарского", 33);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (5, 2, "Беларусь", "Минск", "Плеханова", 46);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (6, 2, "Беларусь", "Минск", "Козлова", 47);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (7, 3, "Беларусь", "Мирнкс", "Платонова", 33);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (8, 1, "Беларусь", "Минск", "П.Бровки", 33);


INSERT INTO `Supplier` (`idSupplier`, `name`, `email`, `phone`, `about`)
VALUES (1, "Завод хмеля", "supplier1@mail.ru", "80441237234", "Крупнейший поставщик хмеля");
INSERT INTO `Supplier` (`idSupplier`, `name`, `email`, `phone`, `about`)
VALUES (2, "Завод мяса", "supplier2@mail.ru", "80441237235", "Крупнейшний поставщик мяса");

INSERT INTO `Goods` (`idGoods`, `name`, `about`, `quantity`, `price`) VALUES (1, "Мясо", "Свежее мясо", 300, 20.5);
INSERT INTO `Goods` (`idGoods`, `name`, `about`, `quantity`, `price`) VALUES (2, "Кетчуп", "Кетчуп Heinz", 0, 4.5);
INSERT INTO `Goods` (`idGoods`, `name`, `about`, `quantity`, `price`)
VALUES (3, "Пиво", "Лидское пиво 'Бархотное'", 0, 200);
INSERT INTO `Goods` (`idGoods`, `name`, `about`, `quantity`, `price`) VALUES (4, "Сыр", "Сыры президент", 0, 200);

INSERT INTO `m2m_goods_address` (`idGoods`, `idAddress`) VALUES (1, 4);
INSERT INTO `m2m_goods_address` (`idGoods`, `idAddress`) VALUES (1, 8);

INSERT INTO `Supply` (`idSupply`, `idGoods`, `idSupplier`, `date`, `quantity`)
VALUES (1, 1, 2, '2016-09-01', 500);
INSERT INTO `Supply` (`idSupply`, `idGoods`, `idSupplier`, `date`, `quantity`)
VALUES (2, 1, 2, '2016-09-01', 500);
INSERT INTO `Supply` (`idSupply`, `idGoods`, `idSupplier`, `date`, `quantity`)
VALUES (3, 1, 2, '2016-09-01', 500);

INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (1, 1, 2, '2016-01-01', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (2, 2, 3, '2016-02-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (3, 3, 4, '2016-03-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (4, 4, 5, '2016-04-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (5, 1, 2, '2016-05-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (6, 2, 3, '2016-06-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (7, 3, 4, '2016-07-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (8, 4, 5, '2016-08-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (9, 2, 2, '2016-09-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (10, 1, 3, '2016-10-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (11, 3, 5, '2016-11-05', 200);
INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (12, 4, 4, '2016-12-05', 200);

INSERT INTO `Purchase` (`idPurchase`, `idGoods`, `idClient`, `frequency`, `quantity`) VALUES (1, 1, 2, 3, 200);
INSERT INTO `Purchase` (`idPurchase`, `idGoods`, `idClient`, `frequency`, `quantity`) VALUES (2, 2, 3, 3, 200);
INSERT INTO `Purchase` (`idPurchase`, `idGoods`, `idClient`, `frequency`, `quantity`) VALUES (3, 1, 2, 3, 200);
INSERT INTO `Purchase` (`idPurchase`, `idGoods`, `idClient`, `frequency`, `quantity`) VALUES (4, 3, 4, 3, 200);
INSERT INTO `Purchase` (`idPurchase`, `idGoods`, `idClient`, `frequency`, `quantity`) VALUES (5, 4, 5, 3, 200);
