import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = ["./", "projects/", "projects/maanak/", "resume/"];

/** Collects console errors and uncaught exceptions for the whole test. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("smoke", () => {
  for (const path of PAGES) {
    test(`${path} renders with no console errors`, async ({ page }) => {
      const errors = watchErrors(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Quick navigation" })).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }

  test("home page shows every section", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hi, I'm Antra Kumari");
    for (const name of [
      "about",
      "skills",
      "education",
      "projects",
      "activity",
      "hackathons",
      "contact",
    ]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /Case study/ }).first()).toBeVisible();
  });

  test("unknown pages get the sleeping cat 404", async ({ page }) => {
    const response = await page.goto("no-such-page/");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page is asleep");
    await expect(page.getByRole("link", { name: "Go home" })).toBeVisible();
  });
});

test.describe("command menu", () => {
  test("opens, filters, runs and closes from the keyboard", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("./");
    const trigger = page.getByRole("button", { name: /Open the command menu/ }).first();
    await trigger.focus();

    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Command menu" });
    await expect(dialog).toBeVisible();
    const input = dialog.getByRole("combobox");
    await expect(input).toBeFocused();

    // Tab must stay inside the dialog while it is open.
    await page.keyboard.press("Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);
    await input.focus();

    await input.fill("hackathons");
    await expect(dialog.getByRole("option", { name: "Hackathons" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(page.locator("#hackathons")).toBeInViewport();

    await page.keyboard.press("ControlOrMeta+k");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(errors).toEqual([]);
  });

  test("returns focus to the button that opened it", async ({ page }) => {
    await page.goto("./");
    const trigger = page.locator("header").getByRole("button", { name: /Open the command menu/ });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Command menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("finds a project by tag and opens its case study", async ({ page }) => {
    await page.goto("./");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Command menu" });
    await dialog.getByRole("combobox").fill("fastapi");
    await expect(dialog.getByRole("option", { name: /Maanak/ })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/maanak\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Maanak");
  });
});

test.describe("theme", () => {
  test("toggle switches to dark, and the choice survives a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("./");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/\bdark\b/);
    const toggle = page.getByRole("button", { name: "Dark theme" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(html).toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(html).toHaveClass(/\bdark\b/);
  });

  test("follows the system setting when nothing is saved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("./");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });
});

test.describe("accessibility", () => {
  for (const scheme of ["light", "dark"] as const) {
    for (const path of [...PAGES, "no-such-page/"]) {
      test(`${path} has no axe violations in ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(
          results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`),
        ).toEqual([]);
      });
    }
  }

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("./");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });
});

test.describe("layout", () => {
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    test(`no sideways scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, path).toBeLessThanOrEqual(0);
      }
    });
  }

  test("reduced motion shows the first tagline without typing", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./");
    await expect(page.locator("#top")).toContainText("coffee and code");
    await page.waitForTimeout(2500);
    await expect(page.locator("#top")).toContainText("coffee and code");
  });
});
