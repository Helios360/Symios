import mysql from 'mysql2/promise';
import { DATABASE_URL } from '$env/static/private';

export const pool = mysql.createPool(DATABASE_URL);