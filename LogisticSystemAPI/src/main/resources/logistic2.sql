CREATE DATABASE IF NOT EXISTS `logistic` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `logistic`;

DROP TABLE IF EXISTS `Purchase`;
DROP TABLE IF EXISTS `Buy`;
DROP TABLE IF EXISTS `Supply`;
DROP TABLE IF EXISTS `m2m_goods_address`;
DROP TABLE IF EXISTS `Goods`;
DROP TABLE IF EXISTS `Supplier`;
DROP TABLE IF EXISTS `Address`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Role`;

CREATE TABLE IF NOT EXISTS `Role` (
  `idRole`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `NameRole` VARCHAR(45)  NOT NULL,
  UNIQUE INDEX `idRole_UNIQUE` (`idRole` ASC),
  UNIQUE INDEX `NameRole_UNIQUE` (`NameRole` ASC),
  PRIMARY KEY (`idRole`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `User` (
  `idUser`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idRole`   INT UNSIGNED NOT NULL,
  `name`     VARCHAR(50)  NOT NULL,
  `email`    VARCHAR(50)  NOT NULL,
  `phone`    VARCHAR(13)  NOT NULL,
  `about`    VARCHAR(200),
  `Username` VARCHAR(45)  NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC),
  CONSTRAINT `idRole` FOREIGN KEY (`idRole`) REFERENCES `Role` (`idRole`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`idUser`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Address` (
  `idAddress` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idUser`    INT UNSIGNED,
  `Country`   VARCHAR(50)  NOT NULL,
  `City`      VARCHAR(50)  NOT NULL,
  `Street`    VARCHAR(50)  NOT NULL,
  `Number`    INT          NOT NULL,
  UNIQUE INDEX `idAddress_UNIQUE` (`idAddress` ASC),
  CONSTRAINT `idUser` FOREIGN KEY (`idUser`) REFERENCES `User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`idAddress`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Supplier` (
  `idSupplier` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(50)  NOT NULL,
  `email`      VARCHAR(50)  NOT NULL,
  `phone`      VARCHAR(13)  NOT NULL,
  `about`      VARCHAR(200),
  UNIQUE INDEX `idSupplier_UNIQUE` (`idSupplier` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC),
  PRIMARY KEY (`idSupplier`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Goods` (
  `idGoods`  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`     VARCHAR(50)  NOT NULL,
  `about`    VARCHAR(200),
  `quantity` FLOAT        NOT NULL,
  `price`    FLOAT        NOT NULL,
  UNIQUE INDEX `idGoods_UNIQUE` (`idGoods` ASC),
  PRIMARY KEY (`idGoods`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `m2m_goods_address` (
  `idGoods`   INT UNSIGNED NOT NULL,
  `idAddress` INT UNSIGNED NOT NULL,
  CONSTRAINT `idGoods` FOREIGN KEY (`idGoods`) REFERENCES `Goods` (`idGoods`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `idAddress` FOREIGN KEY (`idAddress`) REFERENCES `Address` (`idAddress`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`idGoods`, `idAddress`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Supply` (
  `idSupply`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idGoods`    INT UNSIGNED NOT NULL,
  `idSupplier` INT UNSIGNED NOT NULL,
  `date`       DATE         NOT NULL,
  `quantity`   FLOAT        NOT NULL,
  UNIQUE INDEX `idSupply_UNIQUE` (`idSupply` ASC),
  CONSTRAINT `idGoodsSupply` FOREIGN KEY (`idGoods`) REFERENCES `Goods` (`idGoods`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `idSupplier` FOREIGN KEY (`idSupplier`) REFERENCES `Supplier` (`idSupplier`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`idSupply`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Buy` (
  `idBuy`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idGoods`  INT UNSIGNED NOT NULL,
  `idClient` INT UNSIGNED NOT NULL,
  `date`     DATE         NOT NULL,
  `quantity` FLOAT        NOT NULL,
  UNIQUE INDEX `idBuy_UNIQUE` (`idBuy` ASC),
  CONSTRAINT `idGoodsBuy` FOREIGN KEY (`idGoods`) REFERENCES `Goods` (`idGoods`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `idClient` FOREIGN KEY (`idClient`) REFERENCES `User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`idBuy`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Purchase` (
  `idPurchase` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idGoods`    INT UNSIGNED NOT NULL,
  `idClient`   INT UNSIGNED NOT NULL,
  `frequency`  INT          NOT NULL,
  `quantity`   FLOAT        NOT NULL,
  UNIQUE INDEX `idPurchase_UNIQUE` (`idPurchase` ASC),
  CONSTRAINT `idGoodsPurchase` FOREIGN KEY (`idGoods`) REFERENCES `Goods` (`idGoods`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `idClientPurchase` FOREIGN KEY (`idClient`) REFERENCES `User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`idPurchase`)
)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;
