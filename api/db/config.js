import pkg from "pg";
import dotenv from 'dotenv'
import util from 'util'

dotenv.config() ;
const {Pool} = pkg ;


const sql_pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // ✅ needed for many hosted services
    }
  });


const pool = {
    query : (sql,args) =>{
        return util.promisify(sql_pool.query).call(sql_pool,sql,args) ;
    }
}
export default pool ;