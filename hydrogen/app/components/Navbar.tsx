import React, { useState } from "react";
import { applyThemeStyles } from "~/util/theme";
import type { NavBarProps } from "~/types/component";
import { urlFor } from "~/util/imageUrl";
import '~/styles/Navbar.css';

export const Navbar: React.FC<NavBarProps> = ({
    theme,
    logo,
    menuItems,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const localThemeStyles = applyThemeStyles(theme);
    const optimizedlogoUrl = logo?.asset?._ref ? urlFor(logo).url() : undefined;

    return (
        <nav className="custom-navbar" style={localThemeStyles}>
            <div className="navbar-container">
                <div className="navbar-inner">

                    <div className="navbar-brand">
                        <a href="/">
                            <img
                                className="navbar-logo"
                                src={optimizedlogoUrl}
                                alt={logo?.alt || "Company Logo"}
                            />
                        </a>
                    </div>

                    <div className="navbar-desktop-menu">
                        {menuItems?.map((item) => (
                            <a
                                key={item._key}
                                href={item.url}
                                className="navbar-link"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="navbar-mobile-toggle">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="navbar-toggle-btn"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen
                                ? (
                                    <svg
                                        className="icon-svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )
                                : (
                                    <svg
                                        className="icon-svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Panel */}
            {isOpen && (
                <div className="navbar-mobile-menu" id="mobile-menu">
                    {menuItems?.map((item) => (
                        <a
                            key={item._key}
                            href={item.url}
                            className="navbar-mobile-link"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};
