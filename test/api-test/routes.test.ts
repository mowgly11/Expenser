import { expect, test } from "bun:test";

test("Successful request to landing page", async () => {
    const success = await fetch("http://localhost:3000");

    expect(success.status).toBe(200);
});

test("Successful request to login page", async () => {
    const success = await fetch("http://localhost:3000/login");

    expect(success.status).toBe(200);
});