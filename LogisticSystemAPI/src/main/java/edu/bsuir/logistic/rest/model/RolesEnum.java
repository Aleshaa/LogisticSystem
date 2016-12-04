package edu.bsuir.logistic.rest.model;

public enum RolesEnum {

    ADMIN(1),
    USER(2);

    private Integer value;

    RolesEnum(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }
}
