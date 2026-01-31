import React, { useState } from "react";
import "../../css/Sidebar.css";
import CharacterList from "./CharacterList";

const Sidebar: React.FC = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"personal" | "characters">("personal");

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSectionClick = (section: "personal" | "characters") => {
    setActiveSection(section);
    setIsOpen(false); // close sidebar after clicking
  };

  return (
    <div>
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        ☰ Menu
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <span className="close-btn" onClick={toggleSidebar}>
          &times;
        </span>
        <a href="#" onClick={() => handleSectionClick("personal")}>
          Personal Information
        </a>
        <a href="#" onClick={() => handleSectionClick("characters")}>
          Character List
        </a>
      </div>

      {/* Main Content */}
      <div className="content">
        {activeSection === "personal" && (
          <div>
            <h2>Personal Information</h2>
            <p>This section contains your personal details.</p>
          </div>
        )}
        {activeSection === "characters" && (
          <div>
            <h2>Character List</h2>
            <p>This section contains a list of characters.</p>
            <CharacterList memberId={props.memberId}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
