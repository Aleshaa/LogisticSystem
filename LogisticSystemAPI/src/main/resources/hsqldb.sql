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
  idSupplier INT,
  name       VARCHAR(50)  NOT NULL,
  about      VARCHAR(200),
  quantity   FLOAT        NOT NULL,
  price      FLOAT        NOT NULL,
CONSTRAINT idSupplierGoods FOREIGN KEY (idSupplier) REFERENCES Supplier (idSupplier)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (idGoods)
);

CREATE TABLE m2m_goods_address (
  id        IDENTITY,
  idGoods   INT NOT NULL,
  idAddress INT NOT NULL,
  quantity  FLOAT        NOT NULL,
CONSTRAINT idGoods FOREIGN KEY (idGoods) REFERENCES Goods (idGoods)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT idAddress FOREIGN KEY (idAddress) REFERENCES Address (idAddress)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (id)
);

CREATE TABLE Supply (
  idSupply      IDENTITY,
  idGoodsSupply INT NOT NULL,
  idSupplier    INT NOT NULL,
  date          DATE         NOT NULL,
  quantity      FLOAT        NOT NULL,
CONSTRAINT idGoodsSupply FOREIGN KEY (idGoodsSupply) REFERENCES Goods (idGoods)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT idSupplier FOREIGN KEY (idSupplier) REFERENCES Supplier (idSupplier)
ON DELETE CASCADE
ON UPDATE CASCADE,
PRIMARY KEY (idSupply)
);

CREATE TABLE Buy (
  idBuy      IDENTITY,
  idGoodsBuy INT NOT NULL,
  idClient   INT NOT NULL,
  date       DATE         NOT NULL,
  quantity   FLOAT        NOT NULL,
CONSTRAINT idGoodsBuy FOREIGN KEY (idGoodsBuy) REFERENCES Goods (idGoods)
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

INSERT INTO Role (idRole, NameRole) VALUES (1, 'admin');
INSERT INTO Role (idRole, NameRole) VALUES (2, 'user');

INSERT INTO User (idUser, idRole, name, email, phone, about, Username, Password)
VALUES (1, 1, 'Admin', 'kurganovich.aa@gmail.com', '80296993172', 'Администратор', 'admin',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO User (idUser, idRole, name, email, phone, about, Username, Password)
VALUES
  (2, 2, 'User', 'aleshaku14@gmail.com', '80296993173', 'Пользователь', 'user', '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');