"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X, User } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">
                AI Video Generator
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary">
              Home
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-primary"
              >
                Dashboard
              </Link>
            )}
            {session && (
              <Link
                href="/dashboard/videos"
                className="text-gray-700 hover:text-primary"
              >
                My Videos
              </Link>
            )}
            {session && (
              <Link
                href="/dashboard/generate"
                className="text-gray-700 hover:text-primary"
              >
                Generate
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-700">
                    {session.user?.name}
                  </span>
                </div>
                <Button variant="outline" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => signIn()}>
                  Sign In
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary"
              >
                Home
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/videos"
                    className="block px-3 py-2 text-gray-700 hover:text-primary"
                  >
                    My Videos
                  </Link>
                  <Link
                    href="/dashboard/generate"
                    className="block px-3 py-2 text-gray-700 hover:text-primary"
                  >
                    Generate
                  </Link>
                </>
              )}
              <div className="border-t pt-4">
                {session ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2 mb-2">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-700">
                        {session.user?.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut()}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signIn()}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
