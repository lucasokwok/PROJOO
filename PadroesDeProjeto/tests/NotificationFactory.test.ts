import { describe, expect, it } from "vitest";
import { NotificationFactory } from "../src/factory/NotificationFactory";
import { EmailNotification } from "../src/notifications/EmailNotification";
import { PushNotification } from "../src/notifications/PushNotification";
import { SmsNotification } from "../src/notifications/SmsNotification";

describe("NotificationFactory", () => {
  it("deve criar EmailNotification", () => {
    const notification = NotificationFactory.create("email");
    expect(notification).toBeInstanceOf(EmailNotification);
  });

  it("deve criar SmsNotification", () => {
    const notification = NotificationFactory.create("sms");
    expect(notification).toBeInstanceOf(SmsNotification);
  });

  it("deve criar PushNotification", () => {
    const notification = NotificationFactory.create("push");
    expect(notification).toBeInstanceOf(PushNotification);
  });
});
