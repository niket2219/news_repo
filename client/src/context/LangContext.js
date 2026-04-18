import React, { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const toggle = () => setLang(l => l === 'en' ? 'hi' : 'en');
  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);

export const t = (obj, lang) => obj?.[lang] || obj?.en || obj?.hi || '';
