'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function saveScore(formData: FormData) {
  const username = formData.get('username') as string;
  const score = parseInt(formData.get('score') as string);

  if (!username || isNaN(score)) return;

  try {
    // 1. Ensure table exists
    await sql`CREATE TABLE IF NOT EXISTS leaderboard (id SERIAL PRIMARY KEY, username VARCHAR(50), score INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    
    // 2. Insert the NEW score (We insert first, then prune)
    await sql`INSERT INTO leaderboard (username, score) VALUES (${username}, ${score})`;

    // 3. THE FIX: Delete everyone who is NOT in the top 10
    // This subquery finds the IDs of the top 10 scores, and DELETE removes everyone else.
    await sql`
      DELETE FROM leaderboard 
      WHERE id NOT IN (
        SELECT id 
        FROM leaderboard 
        ORDER BY score DESC 
        LIMIT 10
      )
    `;

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false };
  }
}

export async function getLeaderboard() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS leaderboard (id SERIAL PRIMARY KEY, username VARCHAR(50), score INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    
    // Now we just fetch everything, because we know the DB only holds the top 10
    const { rows } = await sql`SELECT * FROM leaderboard ORDER BY score DESC`;
    
    return rows as any[];
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
}