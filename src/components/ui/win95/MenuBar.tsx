interface MenuBarProps {
  menuItems?: string[];
}

export const MenuBar: React.FC<MenuBarProps> = ({ 
  menuItems = ["File", "Edit", "View", "Help"] 
}) => {
  return (
    <div className="win95-menu-bar">
      {menuItems.map((item) => (
        <div 
          key={item}
          className="win95-menu-item"
          role="menuitem"
          tabIndex={0}
        >
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px' }}>
            {item.charAt(0)}
          </span>
          {item.slice(1)}
        </div>
      ))}
    </div>
  );
};
