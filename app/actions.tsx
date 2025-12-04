'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function saveScore(formData: FormData) {
  const username = formData.get('username') as string;
  const score = parseInt(formData.get('score') as string);

  if (!username || isNaN(score)) return;

  try {
    // Ensure table exists (runs once, harmless if exists)
    await sql`CREATE TABLE IF NOT EXISTS leaderboard (id SERIAL PRIMARY KEY, username VARCHAR(50), score INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    
    await sql`INSERT INTO leaderboard (username, score) VALUES (${username}, ${score})`;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false };
  }
}

export async function getLeaderboard() {
  try {
    // Ensure table exists so first load doesn't crash
    await sql`CREATE TABLE IF NOT EXISTS leaderboard (id SERIAL PRIMARY KEY, username VARCHAR(50), score INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    
    const { rows } = await sql`SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10`;
    return rows;
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
}