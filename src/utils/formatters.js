/**
 * Utility functions for formatting text across the application.
 */

/**
 * Removes difficulty suffixes (e.g., " - EASY", " - MEDIUM", " - HARD") from subject names.
 * This ensures that names displayed to the user look cleaner without backend categorization tags.
 * 
 * @param {string} name - The raw subject name from the database.
 * @returns {string} - The formatted subject name.
 */
export const formatSubjectName = (name) => {
    if (!name || typeof name !== 'string') return name;
    // Strip trailing suffixes, ignoring case
    return name.replace(/\s*-\s*(EASY|MEDIUM|MED|HARD|DIFFICULT)\s*$/i, '');
};
