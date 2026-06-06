import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Começar Diagnóstico" }).click();
  await page.getByRole("textbox", { name: "Digite seu nome" }).click();
  await page
    .getByRole("textbox", { name: "Digite seu nome" })
    .fill("sadasdasdasd");
  await page.getByRole("button", { name: "Próxima" }).click();
  await page
    .getByRole("textbox", { name: "Ex: Finanças corporativas," })
    .click();
  await page
    .getByRole("textbox", { name: "Ex: Finanças corporativas," })
    .fill("asdasdasdasd");
  await page.getByRole("button", { name: "Próxima" }).click();
  await page.getByText("Entre 10 e 15 anos").click();
  await page.getByRole("button", { name: "Próxima" }).click();
  await page.getByText("Ainda estou no ambiente").click();
  await page.getByRole("button", { name: "Próxima" }).click();
  await page.getByText("Tenho dificuldade em definir").click();
  await page.getByRole("button", { name: "Próxima" }).click();
  await page.getByRole("textbox", { name: "Seja específico — essa" }).click();
  await page
    .getByRole("textbox", { name: "Seja específico — essa" })
    .fill("asdasdasda");
  await page.getByRole("button", { name: "Próxima" }).click();
  await page.getByRole("textbox", { name: "seu@email.com" }).click();
  await page
    .getByRole("textbox", { name: "seu@email.com" })
    .fill("sadasda@gmail.com");
  await page.getByRole("button", { name: "Próxima" }).click();
  await page
    .locator("div")
    .filter({
      hasText:
        /^Parcialmente — tenho uma ideia, mas ainda está impreciso ou amplo demais$/,
    })
    .click();
  await page.getByRole("button", { name: "Próxima" }).click();
  await page
    .getByRole("textbox", { name: "Ex: Empresas familiares em" })
    .click();
  await page
    .getByRole("textbox", { name: "Ex: Empresas familiares em" })
    .fill("adasdsd");
  await page.getByRole("button", { name: "Próxima" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Não — ainda não iniciei$/ })
    .click();
  await page.getByRole("button", { name: "Próxima" }).click();
  await page.getByText("Como estruturar minha entrada").click();
  await page.getByRole("button", { name: "Próxima" }).click();
  await page.getByText("Nos próximos 3 meses").click();
  await page.getByRole("button", { name: "Próxima" }).click();
  await page
    .getByRole("textbox", { name: "Campo livre — use se quiser" })
    .click();
  await page
    .getByRole("textbox", { name: "Campo livre — use se quiser" })
    .fill("sdasdasdasd");
  await page.getByRole("button", { name: "Finalizar" }).click();
});
