import { expect, type Page } from "@playwright/test";
import credentials from "../test-data/credentials.json";
import { test, type SauceDemoPages } from "./fixtures";

const lockedOutUser = "locked_out_user";

async function signIn(app: SauceDemoPages) {
  await test.step("Sign in with the standard customer account", async () => {
    await app.login.login(credentials.username, credentials.password);
  });
}

async function expectProductsPage(page: Page, app: SauceDemoPages) {
  await test.step("Open the products page", async () => {
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(app.products.title).toHaveText("Products");
  });
}

test.describe("Login", () => {
  test("TC 1 | Sign in successfully with valid credentials", async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);
  });

  test("TC 2 | Show a clear error for an incorrect password", async ({ app }) => {
    await test.step("Try to sign in with an incorrect password", async () => {
      await app.login.login(credentials.username, "invalid_password");
    });

    await test.step("See an explanation of why sign-in failed", async () => {
      await expect(app.login.error).toContainText(
        "Epic sadface: Username and password do not match any user in this service",
      );
    });
  });

  test("TC 3 | Prevent a locked-out customer from signing in", async ({ app }) => {
    await test.step("Try to sign in as a locked-out customer", async () => {
      await app.login.login(lockedOutUser, credentials.password);
    });

    await test.step("See a message explaining that the account is locked", async () => {
      await expect(app.login.error).toContainText(
        "Epic sadface: Sorry, this user has been locked out.",
      );
    });
  });

  test("TC 4 | Show an error when the username is missing", async ({ app }) => {
    await test.step("Try to sign in without a username", async () => {
      await app.login.login("", credentials.password);
    });

    await test.step("See a message that the username is required", async () => {
      await expect(app.login.error).toContainText(
        "Epic sadface: Username is required",
      );
    });
  });

  test("TC 5 | Show an error when the password is missing", async ({ app }) => {
    await test.step("Try to sign in without a password", async () => {
      await app.login.login(credentials.username, "");
    });

    await test.step("See a message that the password is required", async () => {
      await expect(app.login.error).toContainText(
        "Epic sadface: Password is required",
      );
    });
  });

  test("TC 6 | Show an error when both credentials are missing", async ({ app }) => {
    await test.step("Try to sign in without a username or password", async () => {
      await app.login.login("", "");
    });

    await test.step("See a message that the username is required", async () => {
      await expect(app.login.error).toContainText(
        "Epic sadface: Username is required",
      );
    });
  });
});

test.describe("Product catalogue", () => {
  test.beforeEach(async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);
  });

  test("TC 7 | Display six products with names and prices", async ({ app }) => {
    const products = app.products.items;
    await test.step("Review the complete product catalogue", async () => {
      await expect(products).toHaveCount(6);

      for (const product of await products.all()) {
        await expect(app.products.itemName(product)).not.toBeEmpty();
        await expect(app.products.itemPrice(product)).toHaveText(
          /^\$\d+\.\d{2}$/,
        );
      }
    });
  });
});

test.describe("Shopping cart", () => {
  test("TC 8 | Add and remove a product from the cart", async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);

    await test.step("Add the backpack to the cart", async () => {
      await app.products.addBackpack.click();
      await expect(app.products.cartBadge).toHaveText("1");
    });

    await test.step("Remove the backpack again", async () => {
      await app.products.removeBackpack.click();
      await expect(app.products.cartBadge).toHaveCount(0);
    });
  });

  test("TC 14 | Keep products in the cart while browsing", async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);
    await app.products.addBackpack.click();
    await app.products.cartLink.click();

    await expect(app.cart.items).toHaveCount(1);
    await app.cart.continueShopping.click();
    await expectProductsPage(page, app);
    await app.products.cartLink.click();

    await expect(app.cart.items).toHaveCount(1);
    await expect(app.products.cartBadge).toHaveText("1");
  });

  test("TC 15 | Remove a product from the cart page", async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);
    await app.products.addBackpack.click();
    await app.products.cartLink.click();

    await app.cart.removeBackpack.click();

    await expect(app.cart.items).toHaveCount(0);
    await expect(app.products.cartBadge).toHaveCount(0);
  });
});

test.describe("Checkout", () => {
  test("TC 9 | Complete an order for two products", async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);

    await test.step("Put a backpack and bike light in the cart", async () => {
      await app.products.addBackpack.click();
      await app.products.addBikeLight.click();
      await expect(app.products.cartBadge).toHaveText("2");
    });

    await test.step("Review the two products in the cart", async () => {
      await app.products.cartLink.click();
      await expect(app.cart.items).toHaveCount(2);
    });

    await test.step("Enter delivery information", async () => {
      await app.cart.checkout.click();
      await app.checkout.firstName.fill("Test");
      await app.checkout.lastName.fill("Customer");
      await app.checkout.postalCode.fill("12345");
      await app.checkout.continueButton.click();
    });

    await test.step("Review and finish the order", async () => {
      await expect(app.cart.items).toHaveCount(2);
      await app.checkout.finish.click();
    });

    await test.step("Receive confirmation that the order was dispatched", async () => {
      await expect(app.checkout.completeHeader).toHaveText(
        "Thank you for your order!",
      );
      await expect(app.checkout.completeText).toContainText(
        "Your order has been dispatched",
      );
    });
  });

  test("TC 16 | Require a first name before continuing checkout", async ({ app }) => {
    await signIn(app);
    await app.products.addBackpack.click();
    await app.products.cartLink.click();
    await app.cart.checkout.click();
    await app.checkout.lastName.fill("Customer");
    await app.checkout.postalCode.fill("12345");
    await app.checkout.continueButton.click();

    await expect(app.checkout.error).toContainText(
      "Error: First Name is required",
    );
  });

  test("TC 17 | Require a last name before continuing checkout", async ({ app }) => {
    await signIn(app);
    await app.products.addBackpack.click();
    await app.products.cartLink.click();
    await app.cart.checkout.click();
    await app.checkout.firstName.fill("Test");
    await app.checkout.postalCode.fill("12345");
    await app.checkout.continueButton.click();

    await expect(app.checkout.error).toContainText(
      "Error: Last Name is required",
    );
  });

  test("TC 18 | Require a postal code before continuing checkout", async ({ app }) => {
    await signIn(app);
    await app.products.addBackpack.click();
    await app.products.cartLink.click();
    await app.cart.checkout.click();
    await app.checkout.firstName.fill("Test");
    await app.checkout.lastName.fill("Customer");
    await app.checkout.continueButton.click();

    await expect(app.checkout.error).toContainText(
      "Error: Postal Code is required",
    );
  });

  test("TC 19 | Show the correct subtotal, tax, and total", async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);
    await app.products.addBackpack.click();
    await app.products.addBikeLight.click();
    await app.products.cartLink.click();
    await app.cart.checkout.click();
    await app.checkout.firstName.fill("Test");
    await app.checkout.lastName.fill("Customer");
    await app.checkout.postalCode.fill("12345");
    await app.checkout.continueButton.click();

    await expect(app.checkout.subtotal).toHaveText("Item total: $39.98");
    await expect(app.checkout.tax).toHaveText("Tax: $3.20");
    await expect(app.checkout.total).toHaveText("Total: $43.18");
  });

  test("TC 20 | Cancel checkout and return to the cart", async ({ page, app }) => {
    await signIn(app);
    await app.products.addBackpack.click();
    await app.products.cartLink.click();
    await app.cart.checkout.click();
    await app.checkout.cancel.click();

    await expect(page).toHaveURL(/cart\.html$/);
    await expect(app.cart.items).toHaveCount(1);
  });

  test("TC 21 | Cancel the order review and return to products", async ({ page, app }) => {
    await signIn(app);
    await app.products.addBackpack.click();
    await app.products.cartLink.click();
    await app.cart.checkout.click();
    await app.checkout.firstName.fill("Test");
    await app.checkout.lastName.fill("Customer");
    await app.checkout.postalCode.fill("12345");
    await app.checkout.continueButton.click();
    await app.checkout.cancel.click();

    await expectProductsPage(page, app);
  });
});

test.describe("Product sorting", () => {
  test.beforeEach(async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);
  });

  async function productNames(app: SauceDemoPages) {
    return app.products.names.allTextContents();
  }

  async function productPrices(app: SauceDemoPages) {
    const prices = await app.products.prices.allTextContents();
    return prices.map((price) => Number(price.replace("$", "")));
  }

  test("TC 10 | Sort names from A to Z", async ({ app }) => {
    await test.step("Choose name sorting from A to Z", async () => {
      await app.products.sort.selectOption("az");
      const names = await productNames(app);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });
  });

  test("TC 11 | Sort names from Z to A", async ({ app }) => {
    await test.step("Choose name sorting from Z to A", async () => {
      await app.products.sort.selectOption("za");
      const names = await productNames(app);
      expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    });
  });

  test("TC 12 | Sort prices from low to high", async ({ app }) => {
    await test.step("Choose price sorting from low to high", async () => {
      await app.products.sort.selectOption("lohi");
      const prices = await productPrices(app);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
  });

  test("TC 13 | Sort prices from high to low", async ({ app }) => {
    await test.step("Choose price sorting from high to low", async () => {
      await app.products.sort.selectOption("hilo");
      const prices = await productPrices(app);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });
});

test.describe("Account", () => {
  test("TC 22 | Log out and prevent access to inventory", async ({ page, app }) => {
    await signIn(app);
    await expectProductsPage(page, app);
    await app.account.openMenu.click();
    await app.account.logout.click();

    await expect(app.login.loginButton).toBeVisible();
    await page.goto("/inventory.html");

    await expect(app.login.loginButton).toBeVisible();
    await expect(page).toHaveURL("/");
  });
});
