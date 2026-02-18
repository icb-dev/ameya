import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';

const KeywordsDisplay = () => {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        // Public keywords list endpoint (no auth required)
        const res = await fetch(`${API_BASE}/api/keywords`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.error('Keywords API Error status:', res.status);
          setKeywords([]);
          return;
        }

        const data = await res.json();

        // Response can be:
        // - array
        // - { keywords: [...] }
        // - { data: { keywords: [...] } }
        // - { data: [...] }
        const keywordsArray = Array.isArray(data)
          ? data
          : data.keywords ||
            data.data?.keywords ||
            (Array.isArray(data.data) ? data.data : []);

        // Filter only active keywords (is_active === 1 or true, or not explicitly false)
        const activeKeywords = keywordsArray.filter((k) => {
          const isActive = k.is_active !== false && k.is_active !== 0 && k.is_active !== '0';
          return isActive;
        });

        setKeywords(activeKeywords);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching keywords:', err);
        // Silently fail - don't show error to users
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  const handleKeywordClick = async (keyword) => {
    if (!keyword.redirect_url) {
      return; // No redirect URL, do nothing
    }

    try {
      // Track click if redirect URL exists
      if (keyword.id) {
        // Call redirect endpoint to track click
        await fetch(`${API_BASE}/api/keywords/redirect/${encodeURIComponent(keyword.keyword)}`, {
          method: 'GET',
        }).catch(() => {
          // Silently fail if tracking fails
        });
      }

      // Handle redirect
      if (keyword.redirect_url.startsWith('http://') || keyword.redirect_url.startsWith('https://')) {
        window.open(keyword.redirect_url, '_blank', 'noopener,noreferrer');
      } else if (keyword.redirect_url.startsWith('/')) {
        navigate(keyword.redirect_url);
      } else {
        window.location.href = keyword.redirect_url;
      }
    } catch (err) {
      console.error('Error handling keyword click:', err);
    }
  };

  if (loading) {
    return null;
  }

  if (keywords.length === 0) {
    // Don't show anything if no keywords (backend might not have any yet)
    return null;
  }

  return (
    <section className="py-8 px-6 md:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {keywords.map((keyword) => (
            <button
              key={keyword.id}
              onClick={() => handleKeywordClick(keyword)}
              disabled={!keyword.redirect_url}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                keyword.redirect_url
                  ? 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-md hover:scale-105 cursor-pointer'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60'
              }`}
              title={keyword.redirect_url ? `Click to visit: ${keyword.redirect_url}` : 'No redirect URL'}
            >
              {keyword.keyword}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeywordsDisplay;

