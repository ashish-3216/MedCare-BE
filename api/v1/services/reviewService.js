import pool from "../../db/config.js";

export const getReviews = async () => {
  try {
    const result = await pool.query(
      `SELECT a.* , b.doc_name , b.img_url , b.specialization 
            FROM REVIEWS as a
            JOIN doctors as b
            ON a.doc_id = b.id `,
      []
    );
    if (result.rowCount === 0) {
      return {
        success: false,
        message: "no reviews found",
      };
    }
    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const addReview = async (data) => {
  try {
    const { doctor_id, review , rating } = data;
    const result = await pool.query(
      `INSERT INTO reviews (doc_id, review_text,rating) VALUES ($1, $2,$3) RETURNING *`,
      [doctor_id, review,rating]
    );
    console.log("Review inserted:", result.rows[0]);
    return{
        success : true ,
        message : "review added successfully",
    }
  } catch (err) {
    return{
        success : true ,
        message : "review failed to add ",
    }
  }
};
