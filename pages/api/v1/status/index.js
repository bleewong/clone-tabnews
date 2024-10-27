import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  let databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  let databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  console.log(databaseName);
  const databaseOpenedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  console.log(databaseOpenedConnectionResult.rows);

  const databaseOpenedConnectionValue =
    databaseOpenedConnectionResult.rows[0].count;
  console.log(databaseOpenedConnectionValue);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionValue,
      },
    },
  });
}

export default status;
