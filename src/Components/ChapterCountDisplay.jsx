import React, { useState, useEffect } from 'react';
import API from '../api/api';

const ChapterCountDisplay = ({ subject }) => {
    // Always try to use the pre-populated properties first.
    const [count, setCount] = useState(() => {
        if (subject.chapters && Array.isArray(subject.chapters)) {
            return subject.chapters.length;
        }
        if (subject.chapters_count !== undefined && subject.chapters_count !== null) {
            return subject.chapters_count;
        }
        if (subject.chapter_count !== undefined && subject.chapter_count !== null) {
            return subject.chapter_count;
        }
        return null; // Signals we need to fetch it
    });

    useEffect(() => {
        if (count !== null) return; // Don't fetch if we already have it computationally

        let isMounted = true;

        // Fire API request on-demand to calculate the array length
        API.post('/chapters', { subject_id: subject.id })
            .then(res => {
                if (isMounted) {
                    // Depending on API wrapping format
                    const chaptersData = Array.isArray(res.data?.data)
                        ? res.data.data
                        : (Array.isArray(res.data) ? res.data : []);

                    setCount(chaptersData.length);
                }
            })
            .catch(err => {
                console.error("Failed to fetch chapter count for", subject.name, err);
                if (isMounted) {
                    setCount(0);
                }
            });

        return () => { isMounted = false; };
    }, [subject.id, count]);

    return (
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            {count !== null ? count : '...'} Chapters
        </span>
    );
};

export default ChapterCountDisplay;
