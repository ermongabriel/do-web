import { createContext, useContext, type ReactNode } from "react";
import { container as defaultContainer } from "./container";

const DIContext = createContext(defaultContainer);

export function DIProvider({ 
  children,
  container = defaultContainer,
}: {
  children: ReactNode;
  container?: typeof defaultContainer; 
}) {
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
}

export function useService<T>(token: string): T {  
  const container = useContext(DIContext);
  return container.resolve<T>(token);
} 