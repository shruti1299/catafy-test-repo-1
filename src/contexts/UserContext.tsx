"use client";

import React, { createContext, useContext, useMemo, useState } from 'react';
import { IStoreDetail } from '@/interfaces/Store';

interface UserContextType {
    storeDetail: IStoreDetail;
    setStoreDetail: React.Dispatch<React.SetStateAction<IStoreDetail>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [storeDetail, setStoreDetail] = useState<IStoreDetail>({} as IStoreDetail);
    const value = useMemo(() => ({ storeDetail, setStoreDetail }), [storeDetail]);
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};