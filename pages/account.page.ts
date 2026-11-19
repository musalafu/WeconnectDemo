import type { Page } from "@playwright/test";

export class AccountPage {
  readonly openMenu;
  readonly logout;

  constructor(page: Page) {
    this.openMenu = page.getByRole("button", { name: "Open Menu" });
    this.logout = page.getByTestId("logout-sidebar-link");
  }
}
