import colors from '@constants/colors';
import React, {createContext, useEffect, useState} from 'react';
import {ColorSchemeName, StatusBar, useColorScheme} from 'react-native';
import {DARK, LIGHT} from '../constants/const';

export const ThemeContext = createContext({
  theme: '' as ColorSchemeName,
  toggleTheme: () => {},
  settheme: () => {},
});

const ThemeContextProvider = (props: any) => {
  const darkMode = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(darkMode);
  const toggleTheme = () => {
    theme === LIGHT ? setTheme(DARK) : setTheme(LIGHT);
  };

  const settheme = () => {
    setTheme(theme);
  };

  useEffect(() => {
    darkMode === 'dark' ? setTheme(DARK) : setTheme(LIGHT);

    return () => {
      setTheme(darkMode);
    };
  }, [darkMode]);

  const bgColor = theme === LIGHT ? colors.lightTheme : colors.darkTheme;

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, settheme}}>
      <StatusBar
        backgroundColor={bgColor}
        barStyle={theme === LIGHT ? 'dark-content' : 'light-content'}
      />
      <>{props.children}</>
    </ThemeContext.Provider>
  );
};
export default ThemeContextProvider;
