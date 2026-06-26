import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = "https://motbailfflvxstzvicxs.supabase.co"
const supabaseKey = 'sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1';

const supabase = createClient(supabaseUrl, supabaseKey)

export async function signUp(email, password, cpf, nome, tipo) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          cpf: cpf,
          nome: nome,
          tipo_de_usuario: tipo
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, user: data.user };

  } catch (error) {
    return { success: false, error: error.message };
  }
}