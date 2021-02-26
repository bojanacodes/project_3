import dotenv from 'dotenv'
dotenv.config()

const environment = process.env.NODE_ENV || 'production'
export const port = process.env.PORT || 8000
export const secret = process.env.SECRET || 'dasklflajkdfjkasdfjklajklfjklasdfjkldfklasdfjklsdfjio5thuj8i4rf5thj8i'

// ! if running in development, dbURI will be
// ? mongodb://localhost/arrivrdb-development
// ! if running in testing, dbURI will be
// ? mongodb://localhost/arrivrdb-testing

export const dbURI = environment === 'production'

  ? process.env.MONGODB_URI
  : `mongo://localhost/arrivrdb-${environment}`