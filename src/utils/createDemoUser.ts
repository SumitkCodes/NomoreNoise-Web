import { supabase } from "@/integrations/supabase/client";

export const createDemoUser = async () => {
  try {
    // Try to create the demo user
    const { data, error } = await supabase.auth.signUp({
      email: 'demo@nomorenoise.app',
      password: 'Demo123!',
      options: {
        data: {
          full_name: 'Demo User'
        }
      }
    });

    if (error && !error.message.includes('already registered')) {
      console.error('Error creating demo user:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error creating demo user:', error);
    return { success: false, error: 'Failed to create demo user' };
  }
};

export const loginDemoUser = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo@nomorenoise.app',
      password: 'Demo123!'
    });

    if (error) {
      // If user doesn't exist, try to create it first
      if (error.message.includes('Invalid login credentials')) {
        const createResult = await createDemoUser();
        if (createResult.success) {
          // Try login again after creation
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: 'demo@nomorenoise.app',
            password: 'Demo123!'
          });
          return { success: !loginError, user: loginData?.user, error: loginError?.message };
        }
        return createResult;
      }
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error logging in demo user:', error);
    return { success: false, error: 'Failed to login demo user' };
  }
};