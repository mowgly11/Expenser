import { expect, test } from "bun:test";

test("reject accessing /dashboard when not authenticated", async () => {
    const success = await fetch("http://localhost:3000/dashboard");

    expect(success.url).toBe("http://localhost:3000/login");
});
test("reject accessing /logout when not authenticated", async () => {
    const success = await fetch("http://localhost:3000/logout", { method: "POST" });

    expect(success.url).toBe("http://localhost:3000/login");
});

test("reject accessing /add_expense when not authenticated", async () => {
    const success = await fetch("http://localhost:3000/api/add_expense", { method: "POST" });
    
    expect(success.url).toBe("http://localhost:3000/login");
});

test("reject accessing /delete_expense when not authenticated", async () => {
    const success = await fetch("http://localhost:3000/api/delete_expense", { method: "POST" });

    expect(success.url).toBe("http://localhost:3000/login");
});

test("reject accessing /reports when not authenticated", async () => {
    const success = await fetch("http://localhost:3000/api/reports", { method: "POST" });

    expect(success.url).toBe("http://localhost:3000/login");
});

test("reject accessing /expenses when not authenticated", async () => {
    const success = await fetch("http://localhost:3000/api/expenses", { method: "POST" });

    expect(success.url).toBe("http://localhost:3000/login");
});