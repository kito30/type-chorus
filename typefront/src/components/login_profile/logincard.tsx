import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextType';
import HighlightButton from "../ui-kit/highlightbutton";

export default function LoginCard() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        
        try {
            if (isRegister) {
                if (!username.trim()) {
                    setError('Username is required');
                    setLoading(false);
                    return;
                }
                await register(email, username, password);
            } else {
                await login(email, password);
            }
            // Redirect to profile after successful login/register
            navigate('/profile');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md bg-(--color-background) text-(--color-text) rounded-md flex flex-col gap-4 p-4 ">
            <h1 className="text-balance font-bold">
                {isRegister ? 'Create Account' : 'Sign In To Proceed'}
            </h1>
            
            {error && (
                <div className="bg-red-500/20 text-red-400 rounded-md p-2 text-sm">
                    {error}
                </div>
            )}
            
            <div className="flex flex-col gap-3 ">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-(--color-input-background) text-(--color-text) rounded-md p-2 focus:outline-none focus:ring-0" 
                    autoComplete="email" 
                />
                
                {isRegister && (
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-(--color-input-background) text-(--color-text) rounded-md p-2 focus:outline-none focus:ring-0" 
                        autoComplete="username" 
                    />
                )}
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-(--color-input-background) text-(--color-text) rounded-md p-2 focus:outline-none focus:ring-0" 
                    autoComplete={isRegister ? "new-password" : "current-password"} 
                />
                
                <HighlightButton 
                    text={loading ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Sign In')} 
                    onClick={handleSubmit} 
                    className="self-end" 
                />
                
                <button
                    type="button"
                    onClick={() => {
                        setIsRegister(!isRegister);
                        setError('');
                    }}
                    className="text-sm text-(--color-text) opacity-70 hover:opacity-100 transition-opacity"
                >
                    {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
           </div>
        </div>
    )
}