/**
 * Returns tailwind color classes for text contents, based on the darkMode boolean
 */
export function getTextColors(darkMode) {
    const primary = darkMode ? "text-white" : "text-gray-800";
    const secondary = darkMode ? "text-gray-300" : "text-gray-600";
    return { primary, secondary };
}
//# sourceMappingURL=metaTheme.js.map