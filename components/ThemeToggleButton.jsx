import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={handleThemeToggle}
      variant="outline"
      size="icon"
      className="relative"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.5rem] w-[1.5rem] transition-transform duration-300" />
      ) : (
        <Moon className="h-[1.5rem] w-[1.5rem] transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggleButton;
