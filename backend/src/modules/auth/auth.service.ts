import { supabase } from '../../shared/lib/supabase';

export const registerUser = async (input: {
  email: string;
  password: string;
  name: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: 'PUBLISHER',
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('Este email já está cadastrado');
    }
    throw new Error(error.message);
  }

  return data;
};
