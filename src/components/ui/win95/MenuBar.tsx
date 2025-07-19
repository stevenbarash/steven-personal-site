interface MenuBarProps {
  menuItems?: string[];
}

export const MenuBar: React.FC<MenuBarProps> = ({ 
  menuItems = ["File", "Edit", "View", "Help"] 
}) => {
  return (
    <div className="win95-menu-bar px-2 py-1 flex items-center space-x-4">
      {menuItems.map((item, index) => (
        <div 
          key={index}
          className="win95-menu-item font-mono text-sm font-bold text-black px-2 py-1 cursor-pointer"
          role="menuitem"
          tabIndex={0}
        >
          {item}
        </div>
      ))}
    </div>
  );
}; 