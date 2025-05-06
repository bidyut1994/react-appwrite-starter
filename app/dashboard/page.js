"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/auth";
import ProfileForm from "../components/ProfileForm";

export default function Dashboard() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
              Dashboard
            </h1>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:shadow transition-all flex items-center gap-2 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </header>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4 shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Welcome, {user.name || "User"}!
              </h2>
              <p className="opacity-90">{user.email}</p>
            </div>
          </div>
          <p className="text-blue-100">
            Your account has been active since{" "}
            {new Date(user.$createdAt).toLocaleDateString()}
          </p>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
              <p className="text-lg text-gray-700 font-medium">Loading ...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1  gap-6">
            {showProfileForm ? (
              <ProfileForm onSuccess={() => setShowProfileForm(false)} />
            ) : (
              <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    User Information
                  </h3>
                </div>
                <div className="space-y-3 pl-2">
                  <p className="text-gray-700 flex items-center">
                    <span className="w-24 text-gray-500 text-sm">ID:</span>
                    <span className="font-mono text-sm bg-gray-100 py-1 px-2 rounded">
                      {user.$id}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <span className="w-24 text-gray-500 text-sm">Status:</span>
                    <span
                      className={`inline-flex items-center ${
                        user.emailVerification
                          ? "text-green-700 bg-green-100"
                          : "text-yellow-700 bg-yellow-100"
                      } text-sm py-1 px-2 rounded-full`}
                    >
                      {user.emailVerification ? (
                        <>
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Verified
                        </>
                      ) : (
                        "Not Verified"
                      )}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <span className="w-24 text-gray-500 text-sm">Joined:</span>
                    <span>
                      {new Date(user.$createdAt).toLocaleDateString()}{" "}
                      {new Date(user.$createdAt).toLocaleTimeString()}
                    </span>
                  </p>

                  {user.prefs?.dateOfBirth && (
                    <p className="text-gray-700 flex items-center">
                      <span className="w-24 text-gray-500 text-sm">
                        Birth Date:
                      </span>
                      <span>
                        {new Date(user.prefs.dateOfBirth).toLocaleDateString()}
                      </span>
                    </p>
                  )}

                  {user.prefs?.gender && (
                    <p className="text-gray-700 flex items-center">
                      <span className="w-24 text-gray-500 text-sm">
                        Gender:
                      </span>
                      <span className="capitalize">
                        {user.prefs.gender === "prefer_not_to_say"
                          ? "Prefer not to say"
                          : user.prefs.gender}
                      </span>
                    </p>
                  )}

                  <div className="pt-3">
                    <button
                      onClick={() => setShowProfileForm(!showProfileForm)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      {showProfileForm ? "Cancel Editing" : "Update Profile"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
