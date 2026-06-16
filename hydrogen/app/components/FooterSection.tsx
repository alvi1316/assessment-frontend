import React from "react";
import type { FooterSectionProps } from "~/types/component";
import '~/styles/FooterSection.css';
import { applyThemeStyles } from "~/util/theme";

export const FooterSection: React.FC<FooterSectionProps> = (
    { _id, _type, theme, copyrightText, links },
) => {
    return (
        <footer className="custom-site-footer" style={{...applyThemeStyles(theme)}}>
            <div className="footer-container">
                {links && links.length > 0 && (
                    <nav className="footer-nav" aria-label="Footer Navigation">
                        <ul className="footer-link-list">
                            {links.map((link) => (
                                <li
                                    key={link._key}
                                    className="footer-link-item"
                                >
                                    <a href={link.url} className="footer-link">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                <div className="footer-copyright-section">
                    <p className="footer-copyright-text">{copyrightText}</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
