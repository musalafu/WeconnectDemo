import { test as base } from "@playwright/test";
import { AccountPage } from "../pages/account.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { LoginPage } from "../pages/login.page";
import { ProductsPage } from "../pages/products.page";

export type SauceDemoPages = {
  account: AccountPage;
  cart: CartPage;
  checkout: CheckoutPage;
  login: LoginPage;
  products: ProductsPage;
};

export const test = base.extend<{ app: SauceDemoPages }>({
  app: async ({ page }, use) => {
    await use({
      account: new AccountPage(page),
      cart: new CartPage(page),
      checkout: new CheckoutPage(page),
      login: new LoginPage(page),
      products: new ProductsPage(page),
    });
  },
});
