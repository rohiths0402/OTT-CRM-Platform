package com.productionhouse.crm.dto;


public final class ValidationRules {

    public static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9\\s]).{8,}$";
    public static final String PASSWORD_MESSAGE =
            "Password must be at least 8 characters and include an uppercase letter, "
                    + "a lowercase letter, a number and a special character.";

    public static final String MOBILE_REGEX = "^\\+?\\d{10,15}$";
    public static final String MOBILE_MESSAGE = "Enter a valid mobile number (10 to 15 digits).";

    public static final String OTP_REGEX = "^\\d{6}$";
    public static final String OTP_MESSAGE = "OTP must be 6 digits.";

    private ValidationRules() {
    }
}
