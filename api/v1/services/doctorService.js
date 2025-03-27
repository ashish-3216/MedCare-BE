import pool from "../../db/config.js";
export const getDoctors = async (req, res) => {
  try {
    const result = await pool.query(`Select * from doctors`, []);
    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    return {
      success: false,
      message: "no data" || err.message,
    };
  }
};

export const getDoctorById = async (data) => {
  try {
    const result = await pool.query(`SELECT * FROM doctors WHERE id = $1`, [
      data,
    ]);
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("error while finding this id");
    return {
      success: false,
      message: "invalid id" || err.message,
    };
  }
};

// export const addasDoctor = async (data) =>{
//   try{
//     const {name,degree,special,exp,desc,loc,rating} = data ;
//     const result = await pool.query(
//        `INSERT INTO DOCTORS
//       (doc_name, doc_degree, specialization, experience, description, doc_location, rating)
//       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       [name, degree, special, exp, desc, loc, rating]
//     );
//     return {
//       success : true ,
//       data : result.rows[0],
//     };
//   }catch(err){
//     return{
//       success :false,
//       message : "invalid details" || err.message,
//     }
//   }
// };

export const addDoctor = async (data) => {
  try {
    const {
      doc_name,
      doc_degree,
      specialization,
      experience,
      gender,
      description,
      doc_location,
      rating,
    } = data;
    
    const result = await pool.query(
      `INSERT INTO DOCTORS 
      (doc_name, doc_degree, specialization, experience, gender, description, doc_location, rating) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        doc_name,
        doc_degree,
        specialization,
        experience,
        gender,
        description,
        doc_location,
        rating,
      ]
    );

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Invalid details",
    };
  }
};

export const deleteDoctor = async (data) => {
  try {
    const check = await getDoctorById(data);
    if (!check.success) {
      throw new Error("doctor doesn't exists");
    }
    const result = await pool.query(`Delete From Doctors where id = $1`, [
      data,
    ]);
    return {
      success: true,
      message: "Doctor deleted successfully",
    };
  } catch (err) {
    console.log("error while finding this id");
    return {
      success: false,
      message: "invalid id" || err.message,
    };
  }
};
