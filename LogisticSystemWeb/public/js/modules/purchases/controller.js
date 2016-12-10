'use strict';

module.exports = [
    'purchaseService',
    'authService',
    'supplierService',
    'supplyService',
    'goodsService',
    'addressService',
    'buyService',
    'userService',
    'flashService',
    function (purchaseService, authService, supplierService,
              supplyService, goodsService, addressService,
              buyService, userService, flashService) {
        var vm = this;

        vm.suppliers = [];
        vm.addresses = [];
        vm.purchases = [];
        vm.goods = [];
        vm.newSupply = {};
        vm.newPurchase = {};
        vm.currentGoods = {};
        vm.currentUser = {};
        vm.countOfNonComplete = 0;
        vm.creationForm = false;
        vm.editionForm = false;
        vm.orderForm = false;
        vm.dataLoading = true;
        vm.formAction = formAction;
        vm.getCountOfNonComplete = getCountOfNonComplete;
        vm.isAdmin = isAdmin;
        vm.showEditForm = showEditForm;
        vm.showCreationForm = showCreationForm;
        vm.showOrderForm = showOrderForm;
        vm.confirm = confirm;
        vm.remove = remove;

        initController();

        function initController() {
            getCountOfNonComplete();
            getCurrentUser();
            loadAllGoods();
            loadAllPurchases();
            loadAllSuppliers();
            loadAllAddresses();
            vm.dataLoading = false;
        }

        function formAction() {
            vm.dataLoading = true;
            if (vm.editionForm) {
                edit();
            }
            else if (vm.creationForm) {
                create();
            }
            else if (vm.orderForm) {
                createSupply();
            }
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function showCreationForm() {
            vm.newPurchase = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(purchase) {
            vm.newPurchase.idPurchase = purchase.idPurchase;
            vm.newPurchase.goods = purchase.goods.idGoods;
            vm.newPurchase.frequency = purchase.frequency;
            vm.newPurchase.quantity = purchase.quantity;
            vm.editionForm = true;
            vm.creationForm = false;
        }

        function showOrderForm(goods) {
            vm.currentGoods = goods;
            vm.orderForm = true;
        }

        function confirm(idPurchase) {
            vm.dataLoading = true;
            purchaseService.confirm(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function remove(idPurchase) {
            vm.dataLoading = true;
            purchaseService.remove(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            var idGoods = vm.newPurchase.goods;
            delete vm.newPurchase.goods;
            purchaseService.create(vm.currentUser.idUser, idGoods, vm.newPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.creationForm = false;
                        vm.newPurchase = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так");
                        console.log(response.message);
                    }
                });
        }

        function edit() {
            var idGoods = vm.newPurchase.goods;
            delete vm.newPurchase.goods;
            purchaseService.update(vm.newPurchase, idGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.editionForm = false;
                        vm.newPurchase = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так");
                        console.log(response.message);
                    }
                });
        }

        function loadAllPurchases() {
            purchaseService.getAll()
                .then(function (purchases) {
                    vm.purchases = purchases.data;
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                });
        }

        function createSupply() {
            var idGoods = vm.currentGoods.idGoods;
            var idSupplier = vm.newSupply.supplier;
            var idAddress = vm.newSupply.address;
            delete vm.newSupply.supplier;
            delete vm.newSupply.address;
            var date = new Date();
            vm.newSupply.date = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
            supplyService.create(vm.newSupply, idSupplier, idGoods, idAddress)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.orderForm = false;
                        vm.currentGoods = {};
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function loadAllAddresses() {
            addressService.getAllStores()
                .then(function (addresses) {
                    vm.addresses = addresses.data;
                })
        }

        function loadAllGoods() {
            goodsService.getAll()
                .then(function (goods) {
                    vm.goods = goods.data;
                });
        }

        function getCountOfNonComplete() {
            buyService.getCountOfNonComplete()
                .then(function (count) {
                    if (count.success) {
                        vm.countOfNonComplete = count.data;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(count.message);
                    }
                })
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (user) {
                    vm.currentUser = user.data;
                });
        }
    }
];
