USE `logistic`;

INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (1, 'admin');
INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (2, 'user');

INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (1, 1, 'Admin', 'kurganovich.aa@gmail.com', '80296993172', 'Администратор', 'admin',
        '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES
  (2, 2, 'User', 'aleshaku14@gmail.com', '80296993173', 'Пользователь', 'user',
   '$2a$10$B3qhR/s3JLXZybFaj8uEqO3jfCR/2iceicSRBvawglDt9LfJ7xMhy');
