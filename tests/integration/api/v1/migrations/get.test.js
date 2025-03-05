import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public");
});

test("GET tp /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  /*
  // Assert that specific migrations or schema changes exist
  const tables = await database.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `);

  // Check that tables expected from migrations are present
  const tableNames = tables.rows.map((row) => row.table_name);
  expect(tableNames).toEqual(expect.arrayContaining(["pgmigrations"]));

  // Optionally check data integrity or initial inserts from migrations
  const pgmigrations = await database.query(`SELECT * FROM pgmigrations`);
  expect(pgmigrations.rows).toBeDefined();
  */
});
