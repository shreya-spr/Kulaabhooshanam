import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {
  let dbconnection;

  try {
    // Open a new database connection
    dbconnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Harry@123',
      database: 'kulaabhooshanam_new',
      "keepAliveInitialDelay": 
      10000, "enableKeepAlive": true 
    });

    // Execute the query
    const [results] = await dbconnection.execute(query, values);
    console.log(results)
    return results;
  } catch (error) {
    throw error;
  } 
  finally {
    if (dbconnection) {
      // dbconnection.release();
      dbconnection.end();
    }
  }
}
