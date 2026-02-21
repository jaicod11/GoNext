import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if already logged in on mount
  useEffect(() => {
    const stored = localStorage.getItem('gonext_session');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('gonext_users') || '[]');

    // Check email already exists
    if (users.find(u => u.email === email)) {
      return { error: 'An account with this email already exists.' };
    }

    const newUser = { id: Date.now(), name, email, password, joinedAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('gonext_users', JSON.stringify(users));

    const session = { id: newUser.id, name, email };
    localStorage.setItem('gonext_session', JSON.stringify(session));
    setUser(session);
    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('gonext_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) return { error: 'Invalid email or password.' };

    const session = { id: found.id, name: found.name, email };
    localStorage.setItem('gonext_session', JSON.stringify(session));
    setUser(session);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('gonext_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);