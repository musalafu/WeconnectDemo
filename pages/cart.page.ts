import type { Page } from "@playwright/test";

export class CartPage {
  readonly items;
  readonly removeBackpack;
  readonly checkout;
  readonly continueShopping;

  constructor(page: Page) {
    this.items = page.getByTestId("cart-list").getByTestId("inventory-item");
    this.removeBackpack = page.getByTestId("remove-sauce-labs-backpack");
    this.checkout = page.getByTestId("checkout");
    this.continueShopping = page.getByTestId("continue-shopping");
  }
}
