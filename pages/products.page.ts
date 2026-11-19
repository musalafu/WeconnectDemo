import type { Locator, Page } from "@playwright/test";

export class ProductsPage {
  readonly title;
  readonly items;
  readonly names;
  readonly prices;
  readonly addBackpack;
  readonly removeBackpack;
  readonly addBikeLight;
  readonly cartBadge;
  readonly cartLink;
  readonly sort;

  constructor(page: Page) {
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.names = page.getByTestId("inventory-item-name");
    this.prices = page.getByTestId("inventory-item-price");
    this.addBackpack = page.getByTestId("add-to-cart-sauce-labs-backpack");
    this.removeBackpack = page.getByTestId("remove-sauce-labs-backpack");
    this.addBikeLight = page.getByTestId("add-to-cart-sauce-labs-bike-light");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.sort = page.getByTestId("product-sort-container");
  }

  itemName(item: Locator) {
    return item.getByTestId("inventory-item-name");
  }

  itemPrice(item: Locator) {
    return item.getByTestId("inventory-item-price");
  }
}
