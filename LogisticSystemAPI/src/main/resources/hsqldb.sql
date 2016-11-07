DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS Buy;
DROP TABLE IF EXISTS Supply;
DROP TABLE IF EXISTS m2m_goods_address;
DROP TABLE IF EXISTS Goods;
DROP TABLE IF EXISTS Supplier;
DROP TABLE IF EXISTS Address;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Role;

CREATE TABLE Role (
  idRole   IDENTITY,
  NameRole VARCHAR(45)  NOT NULL,
PRIMARY KEY (idRole)
);

CREATE TABLE User (
  idUser   IDENTITY,
  idRole   INT NOT NULL,
  name     VARCHAR(50)  NOT NULL,
  email    VARCHAR(50)  NOT NULL,
  phone    VARCHAR(13)  NOT NULL,
  about    VARCHAR(200),
  Username VARCHAR(45)  NOT NULL,
  Password VARCHAR(255) NOT NULL,
CONSTRAINT idRole FOREIGN KEY (idRole) REFERENCES Role (idRole)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (idUser)
);

CREATE TABLE Address (
  idAddress IDENTITY,
  idUser    INT,
  Country   VARCHAR(50)  NOT NULL,
  City      VARCHAR(50)  NOT NULL,
  Street    VARCHAR(50)  NOT NULL,
  Number    INT          NOT NULL,
CONSTRAINT idUser FOREIGN KEY (idUser) REFERENCES User (idUser)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (idAddress)
);

CREATE TABLE Supplier (
  idSupplier IDENTITY,
  name       VARCHAR(50)  NOT NULL,
  email      VARCHAR(50)  NOT NULL,
  phone      VARCHAR(13)  NOT NULL,
  about      VARCHAR(200),
PRIMARY KEY (idSupplier)
);

CREATE TABLE Goods (
  idGoods    IDENTITY,
  name       VARCHAR(50)  NOT NULL,
  about      VARCHAR(200),
  quantity   FLOAT        NOT NULL,
  price      FLOAT        NOT NULL,
PRIMARY KEY (idGoods)
);

CREATE TABLE m2m_goods_address (
  idGoods   INT NOT NULL,
  idAddress INT NOT NULL,
CONSTRAINT idGoods FOREIGN KEY (idGoods) REFERENCES Goods (idGoods)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT idAddress FOREIGN KEY (idAddress) REFERENCES Address (idAddress)
ON DELETE CASCADE
ON UPDATE CASCADE,
  PRIMARY KEY (idGoods, idAddress)
);

CREATE TABLE Supply (
  idSupply   IDENTITY,
  idGoods    INT   NOT NULL,
  idSupplier INT   NOT NULL,
  date       DATE  NOT NULL,
  quantity   FLOAT NOT NULL,
  CONSTRAINT idGoodsSupply FOREIGN KEY (idGoods) REFERENCES Goods (idGoods)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT idSupplier FOREIGN KEY (idSupplier) REFERENCES Supplier (idSupplier)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (idSupply)
);

CREATE TABLE Buy (
  idBuy    IDENTITY,
  idGoods  INT   NOT NULL,
  idClient INT   NOT NULL,
  date     DATE  NOT NULL,
  quantity FLOAT NOT NULL,
  CONSTRAINT idGoodsBuy FOREIGN KEY (idGoods) REFERENCES Goods (idGoods)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT idClient FOREIGN KEY (idClient) REFERENCES User (idUser)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (idBuy)
);

CREATE TABLE Purchase (
  idPurchase IDENTITY,
  idGoods    INT NOT NULL,
  idClient   INT NOT NULL,
  frequency  INT          NOT NULL,
  quantity   FLOAT        NOT NULL,
CONSTRAINT idGoodsPurchase FOREIGN KEY (idGoods) REFERENCES Goods (idGoods)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT idClientPurchase FOREIGN KEY (idClient) REFERENCES User (idUser)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (idPurchase)
);

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

INSERT INTO `Supply` (`idSupply`, `idGoods`, `idSupplier`, `date`, `quantity`) VALUES (1, 1, 2, '2016-09-01', 500);

INSERT INTO `Buy` (`idBuy`, `idGoods`, `idClient`, `date`, `quantity`) VALUES (1, 1, 2, '2016-09-05', 200);

INSERT INTO `Purchase` (`idPurchase`, `idGoods`, `idClient`, `frequency`, `quantity`) VALUES (1, 1, 2, 3, 200);