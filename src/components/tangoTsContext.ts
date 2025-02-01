import React from 'react';
import { createContext, useState } from 'react';
import TangoTS from '../utils/TangoTS';

const TangoTSContext = createContext<TangoTS | null>(null);
export function TangoTSProvider({ children }) {
  const [tangoTSInstance, setTangoTSInstance] = useState<TangoTS | null>(null);

  return (
    <TangoTSContext.Provider value={tangoTSInstance}>
            {children}
    </TangoTSContext.Provider>
  );
}

export default TangoTSContext;
