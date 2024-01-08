import mysql from "mysql2/promise";
import { query } from "../../lib/db";
import { NextResponse } from "next/server";


async function Checkadstat(child_id) {
  try {
    console.log("child table status checking--");
    const IdStuff = await query({
      query: 'SELECT children.adoption_status FROM children WHERE child_id = ?',
      values: [child_id]
    });
    console.log(IdStuff)
    console.log("child id checking qafter query");
      return IdStuff;

  } catch (error) {
    console.error("Error in check ID function request:", error);
    return NextResponse.json(
      { message: "error", error: "check ID function -Internal server error" },
      { status: 500 }
    );
  }
}

async function checkIfIDExists(id) {
  try {
    console.log("id checking--");
    const IdStuff = await query({
      query: 'SELECT * FROM children WHERE child_id = ?',
      values: [id]
    });

    console.log("id checking qafter query");
    console.log(IdStuff.length > 0 ? "In children" : "Not in children yet");

    return IdStuff.length > 0;
  } catch (error) {
    console.error("Error in check ID function request:", error);
    return NextResponse.json(
      { message: "error", error: "check ID function -Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
    const req = await request.json();
    const sex = req.sex;
    const name = req.c_name;
    const childid = parseInt(req.cid, 10);
    const childAge = parseInt(req.age, 10);
    const dob = req.dob;
    const doa = req.doa;
    const geneticDisorder = req.genetic_disorder;
    const adoption_status = req.adoption_status;
    const agencyid = parseInt(req.agencyid, 10);

    console.log(childid)
    const query1 = `UPDATE children SET c_name = ?, dob = ?, sex = ?, date_admitted = ?, adoption_status = ?, genetic_disorder = ?, agency_id = ?, age = ? WHERE child_id = ?`;
    const query2 = "UPDATE application SET `appln_status` = ? WHERE `c_id` = ?";
    const query3 = "UPDATE parents SET `appln_status = ? WHERE `c_id` = ?";
    const query4 = "UPDATE adoptionagency SET `numsuccad` = `numsuccadd` + 1"
    try {
      const notRegistered = await checkIfIDExists(childid);
      const idExists = await Checkadstat(childid);
      console.log(idExists);
      if (!notRegistered) {
        return NextResponse.json (
          {message: "Child Does not exist."},
          {status: 200},
        )
      }
      else {
        const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'Harry@123',
          database: 'kulaabhooshanam_new',
          "keepAliveInitialDelay": 
          10000, "enableKeepAlive": true 
        });
    try {
      const ans = await connection.execute(query1, [name, dob, sex, doa, adoption_status, geneticDisorder, agencyid, childAge, childid]);
      console.log("Updated");
      console.log(ans);
      if (idExists[0].adoption_status === 'inhouse' && adoption_status === 'adopted') {
        try {
          const ans = await connection.execute(query2, ['successful', childid]);
        } catch{
          console.error("Error executing query:", error);
          return NextResponse.json(
            { message: "error", error: "Error executing query" },
            { status: 500 }
          );
        }
        try {
          const ans = await connection.execute(query3, ['successful', childid]);
        } catch{
          console.error("Error executing query:", error);
          return NextResponse.json(
            { message: "error", error: "Error executing query" },
            { status: 500 }
          );
        }
        try {
          const ans = await connection.execute(query4, []);
        } catch{
          console.error("Error executing query:", error);
          return NextResponse.json(
            { message: "error", error: "Error executing query" },
            { status: 500 }
          );
        }
      try {
        const ans = await connection.execute(query3, ['successful', childid]);
      } catch{
        console.error("Error executing query:", error);
        return NextResponse.json(
          { message: "error", error: "Error executing query" },
          { status: 500 }
        );
      }
    }
else {
  await connection.end(); 
    return NextResponse.json(
      { message: "success", name: ans },
      { status: 200 }
    );
}
    } catch (error) {
      console.error("Error executing query:", error);
      return NextResponse.json(
        { message: "error", error: "Error executing query" },
        { status: 500 }
      );
    } finally {
      await connection.end(); // Close the connection after executing the query
    }
      }

} catch (error) {
  console.error("Error in POST request:", error);
  return NextResponse.json(
      { message: "error", error: "Internal server error"},
      { status: 500 }
  );
}
}
