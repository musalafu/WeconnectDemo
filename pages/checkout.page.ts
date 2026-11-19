import type { Page } from "@playwright/test";

export class CheckoutPage {
  readonly error;
  readonly firstName;
  readonly lastName;
  readonly postalCode;
  readonly continueButton;
  readonly finish;
  readonly completeHeader;
  readonly completeText;
  readonly subtotal;
  readonly tax;
  readonly total;
  readonly cancel;

  constructor(page: Page) {
    this.error = page.getByTestId("error");
    this.firstName = page.getByTestId("firstName");
    this.lastName = page.getByTestId("lastName");
    this.postalCode = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.finish = page.getByTestId("finish");
    this.completeHeader = page.getByTestId("complete-header");
    this.completeText = page.getByTestId("complete-text");
    this.subtotal = page.getByTestId("subtotal-label");
    this.tax = page.getByTestId("tax-label");
    this.total = page.getByTestId("total-label");
    this.cancel = page.getByTestId("cancel");
  }
}
