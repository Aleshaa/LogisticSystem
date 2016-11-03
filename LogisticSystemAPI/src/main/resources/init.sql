USE `logistic`;

INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (1, 'admin');
INSERT INTO `Role` (`idRole`, `NameRole`) VALUES (2, 'user');

INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES (1, 1, 'Admin', 'kurganovich.aa@gmail.com', '80296993172', 'Администратор', 'admin',
        '21232f297a57a5a743894a0e4a801fc3');
INSERT INTO `User` (`idUser`, `idRole`, `name`, `email`, `phone`, `about`, `Username`, `Password`)
VALUES
  (2, 2, 'User', 'aleshaku14@gmail.com', '80296993173', 'Пользователь', 'user', 'ee11cbb19052e40b07aac0ca060c23ee');
