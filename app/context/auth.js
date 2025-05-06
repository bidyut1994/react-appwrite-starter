"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "../lib/appwrite";
import { ID } from "appwrite";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentAccount = await account.get();
        setUser(currentAccount);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const session = await account.createEmailPasswordSession(email, password);

      const currentAccount = await account.get();
      setUser(currentAccount);

      return { success: true };
    } catch (error) {
      let errorMessage = "Failed to login. Please check your credentials.";

      if (error.code === 401) {
        errorMessage = "Incorrect email or password";
      } else if (error.code === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (error.code === 400) {
        errorMessage = "Invalid email format";
      }

      return {
        success: false,
        error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await account.deleteSession("current");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await account.create(ID.unique(), email, password, name);

      if (response) {
        const loginResult = await login(email, password);
        if (!loginResult.success) {
          return {
            success: false,
            error: new Error("Failed to login after registration"),
            message: "Account created but failed to log in automatically",
          };
        }
        return { success: true };
      }
      return {
        success: false,
        error: new Error("Registration failed"),
        message: "Failed to create account",
      };
    } catch (error) {
      let errorMessage = "Failed to create account. Please try again.";

      if (error.code === 409) {
        errorMessage = "An account with this email already exists";
      } else if (error.message?.includes("password")) {
        errorMessage = "Password must be at least 8 characters";
      } else if (error.code === 400 && error.message?.includes("email")) {
        errorMessage = "Invalid email format";
      }

      return {
        success: false,
        error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      // Update user name if provided
      if (profileData.name && profileData.name !== user.name) {
        await account.updateName(profileData.name);
      }

      // Update user preferences for additional fields
      const prefs = {};

      if (profileData.dateOfBirth) {
        prefs.dateOfBirth = profileData.dateOfBirth;
      }

      if (profileData.gender) {
        prefs.gender = profileData.gender;
      }

      if (Object.keys(prefs).length > 0) {
        await account.updatePrefs(prefs);
      }

      // Refresh user data
      const currentAccount = await account.get();
      setUser(currentAccount);

      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);

      let errorMessage = "Failed to update profile. Please try again.";

      if (error.code === 400) {
        errorMessage = "Invalid information provided";
      }

      return {
        success: false,
        error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
