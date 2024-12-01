// configContext.tsx
import React, { createContext, useContext, useState } from "react";

interface ConfigContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  skipCache: boolean;
  setSkipCache: (skip: boolean) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_OPENAI_API_KEY || ""
  );
  const [skipCache, setSkipCache] = useState(false);

  const value = {
    apiKey,
    skipCache,
    setApiKey,
    setSkipCache,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
