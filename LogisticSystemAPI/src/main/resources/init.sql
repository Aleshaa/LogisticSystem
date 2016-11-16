USE `logistic`;

INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (1, 'ADMIN');
INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (2, 'USER');

INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (1, 1, 'Admin', 'kurganovich.aa@gmail.com', '80296993172', 'Administrator', 'admin',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (2, 2, 'User', 'aleshaku14@gmail.com', '80296993173', 'User', 'user',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (3, 2, 'User2', 'aleshaku142@gmail.com', '80296993174', 'User2', 'user2',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');

INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (1, 2, "Belarus", "Minsk", "Plekhanova", 46);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (2, 2, "Belarus", "Minsk", "Plekhanova", 47);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (3, 3, "Belarus", "Minsk", "Gorovtsa", 33);
INSERT INTO `Address` (`idAddress`, `idUser`, `Country`, `City`, `Street`, `Number`)
VALUES (4, 1, "Belarus", "Mogilev", "Mir", 33);

INSERT INTO `Supplier` (`idSupplier`, `name`, `email`, `phone`, `about`)
VALUES (1, "Supplier", "supplier1@mail.ru", "80441237234", "Supplier number one in the world");
INSERT INTO `Supplier` (`idSupplier`, `name`, `email`, `phone`, `about`)
VALUES (2, "Supplier2", "supplier2@mail.ru", "80441237235", "Supplier number two in the world");

INSERT INTO `Goods` (`idGoods`, `name`, `about`, `quantity`, `price`) VALUES (1, "Good1", "Good number one", 300, 20.5);
INSERT INTO `Goods` (`idGoods`, `name`, `about`, `quantity`, `price`) VALUES (2, "Good2", "Good number two", 0, 4.5);
INSERT INTO `Goods` (`idGoods`, `name`, `about`, `quantity`, `price`) VALUES (3, "Good3", "Good number three", 0, 200);

INSERT INTO `m2m_goods_address` (`idGoods`, `idAddress`) VALUES (1, 4);

INSERT INTO `Supply` (`idSupply`, `idGoods`, `idSupplier`, `date`, `quantity`)
VALUES (1, 1, 2, '2016-09-01', 500);

INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (1, 1, 2, '2016-09-05', 200);

INSERT INTO `Purchase` (`idPurchase`, `idGoods`, `idClient`, `frequency`, `quantity`) VALUES (1, 1, 2, 3, 200);