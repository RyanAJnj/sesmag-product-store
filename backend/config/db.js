import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

export const sql = neon(
  `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`
);
