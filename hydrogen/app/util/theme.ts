import type { CSSProperties } from 'react';
import type { ThemeConfig } from '../types/component';
import { stegaClean } from '@sanity/client/stega';

export const applyThemeStyles = (theme?: ThemeConfig | null): CSSProperties => {
    if(!theme) {
        return {}
    }
    return {
        '--color-text-primary': stegaClean(theme?.colorTextPrimary) || '#111111',
        '--color-text-secondary': stegaClean(theme?.colorTextSecondary) || '#666666',
        '--color-text-accent': stegaClean(theme?.colorTextAccent) || '#0066CC',
        '--color-bg-primary': stegaClean(theme?.colorBgPrimary) || '#FFFFFF',
        '--color-bg-secondary': stegaClean(theme?.colorBgSecondary) || '#F9F9F9',
        '--color-bg-accent': stegaClean(theme?.colorBgAccent) || '#111111',
        '--color-border-default': stegaClean(theme?.colorBorderDefault) || '#E5E5E5',
        '--color-border-muted': stegaClean(theme?.colorBorderMuted) || '#F0F0F0',
        '--color-border-focus': stegaClean(theme?.colorBorderFocus) || '#0066CC',
    } as CSSProperties;
};