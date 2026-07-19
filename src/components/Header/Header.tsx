import { Sun, Moon, User, Grid3X3 } from "lucide-react";
import { Button } from "../Button/Button";
import "./Header.scss";
import { useAppStore, useHeaderMenuSlot } from "../../store";

export function Header() {
  const theme = useAppStore((state) => state.ui.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const { MenuComponent } = useHeaderMenuSlot();

  return (
    <header className="header" data-testid="header">
      <div className="header__left">
        <div className="header__logo">
          <Grid3X3 size={24} className="header__logo-icon" />
          <div className="header__title">
            <h1>Ceiling Grid Studio</h1>
          </div>
        </div>
      </div>

      {MenuComponent && (
        <div className="header__center">
          <MenuComponent />
        </div>
      )}

      <div className="header__right">
        <div className="header__actions">
          <Button
            variant="icon"
            className="header__icon-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
            data-testid="theme-toggle"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          <div className="header__profile">
            <Button
              variant="icon"
              className="header__profile-btn"
              onClick={() => {}}
              aria-label="User profile"
              data-testid="user-profile"
            >
              <User size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
