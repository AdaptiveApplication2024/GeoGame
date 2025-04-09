'use client';

import { createContext, useState } from "react";

export const UserContext = createContext({
    userId: null,
    setUserId: (userId: any) => {} // eslint-disable-line
});

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
}

