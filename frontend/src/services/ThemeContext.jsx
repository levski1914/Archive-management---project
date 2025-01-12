import React, { createContext, useEffect, useState } from "react";

const ThemeContext = createContext(); // Без `export const` тук

export const ThemeProvider = ({ children }) => {
  // Проверяваме дали има запазена стойност в localStorage
  const savedTheme = localStorage.getItem("darkMode") === "true";

  // Начална стойност на darkMode, базирана на localStorage
  const [darkMode, setDarkMode] = useState(savedTheme);

  useEffect(() => {
    // Когато darkMode се променя, запазваме новата стойност в localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]); // Всеки път, когато darkMode се променя

  // Функция за превключване на темата
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; // Default export
