import { useState } from "react";
import { useAuth } from "../../contexts/AuthContextType";

interface LoginCardProps {
    onClose?: () => void;
}

export default function LoginCard({ onClose }: LoginCardProps) {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { login, register } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!username || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            await login(username, password);
            onClose?.();
            // Reset form
            setUsername("");
            setPassword("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!email || !username || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            await register(email, username, password);
            onClose?.();
            // Reset form
            setEmail("");
            setUsername("");
            setPassword("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl">
            <div className="bg-(--color-background) text-(--color-text) rounded-lg flex flex-col gap-4 p-6">
                <h1 className="text-lg font-semibold text-white">{isSignup ? "Create Your Account" : "Sign In To Proceed"}</h1>
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 rounded-md p-3 text-sm">
                        {error}
                    </div>
                )}
                
                {!isSignup ? (
                    <>
                        <form onSubmit={handleLogin}>
                            <div className="flex flex-col gap-3">
                                <input 
                                    type="username" 
                                    placeholder="Username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    autoComplete="username" 
                                    disabled={loading}
                                    required
                                />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    autoComplete="current-password" 
                                    disabled={loading}
                                    required
                                />
                                
                                <div className="flex items-center justify-between mt-2">
                                    <button 
                                        type="button"
                                        className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
                                        onClick={() => {}}
                                    >
                                        I've forgotten my details
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="bg-(--color-primary-button) text-white px-6 py-2.5 rounded-md hover:bg-(--color-primary-button-hover) transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Signing in..." : "Sign in"}
                                        {!loading && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="border-t border-gray-600 mt-4 pt-4 flex flex-col gap-3">
                            <p className="text-white text-sm">Don't have an account?</p>
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-gray-400 text-xs whitespace-nowrap">Create an account to get started!</p>
                                <button 
                                    className="bg-(--color-primary-button) text-white px-6 py-2.5 rounded-md hover:bg-(--color-primary-button-hover) transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                                    onClick={() => {
                                        setIsSignup(true);
                                        setError(null);
                                        setEmail("");
                                        setPassword("");
                                    }}
                                >
                                    Signup
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <form onSubmit={handleRegister}>
                            <div className="flex flex-col gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    autoComplete="username" 
                                    disabled={loading}
                                    required
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    autoComplete="email" 
                                    disabled={loading}
                                    required
                                />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    autoComplete="new-password" 
                                    disabled={loading}
                                    required
                                    minLength={6}
                                />
                                
                                <div className="flex items-center justify-end mt-2">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="bg-(--color-primary-button) text-white px-6 py-2.5 rounded-md hover:bg-(--color-primary-button-hover) transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Signing up..." : "Sign up"}
                                        {!loading && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="border-t border-gray-600 mt-4 pt-4 flex flex-col gap-3">
                            <p className="text-white text-sm">Already have an account?</p>
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-gray-400 text-xs whitespace-nowrap">Sign in to your existing account!</p>
                                <button 
                                    className="bg-(--color-primary-button) text-white px-6 py-2.5 rounded-md hover:bg-(--color-primary-button-hover) transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                                    onClick={() => {
                                        setIsSignup(false);
                                        setError(null);
                                        setEmail("");
                                        setUsername("");
                                        setPassword("");
                                    }}
                                >
                                    Sign in
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}