Feature: Add products to cart

  Background:
    Given User navigates to the application

  @auth
  Scenario: Authenticated Users - Add to cart
    When user search for a "Roomies"
    And user add the book to the cart
    Then the cart badge should get updated

  @auth
  Scenario: UnAuthenticated User - Add to cart
    When user search for a "All of Us with Wings"
    And user add the book to the cart
    Then the cart badge should get updated
