import type { Page } from "@playwright/test";

export class LoginPage {
  readonly username;
  readonly password;
  readonly loginButton;
  readonly error;

  constructor(private readonly page: Page) {
    this.username = page.getByTestId("username");
    this.password = page.getByTestId("password");
    this.loginButton = page.getByTestId("login-button");
    this.error = page.getByTestId("error");
  }

  async login(username: string, password: string) {
    await this.page.goto("/");
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
