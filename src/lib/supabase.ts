import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface GameResult {
  email: string;
  game_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at?: string;
}

export const saveGameResult = async (result: GameResult): Promise<boolean> => {
  // This function will be implemented once Supabase is connected
  console.log('Game result to be saved:', result);
  
  // For now, we'll just return true to simulate saving
  // Once Supabase is connected, this will actually save to the database
  return true;
};

export interface CatalogueImageResult {
  email: string;
  score: number;
}

export const saveCatalogueImageResult = async (result: CatalogueImageResult): Promise<boolean> => {
  try {
    console.log('Saving catalogue image result to Supabase:', result);
    
    const { data, error } = await supabase
      .from('catalogeimage')
      .insert([
        {
          email: result.email,
          score: result.score
        }
      ]);

    if (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }

    console.log('Successfully saved to Supabase:', data);
    return true;
  } catch (error) {
    console.error('Error saving catalogue image result:', error);
    return false;
  }
};