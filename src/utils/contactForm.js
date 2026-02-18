/**
 * Utility function to send contact form data to mail.php
 * @param {Object} formData - Form data object with name, email, phone/mobile
 * @param {string} requestFrom - Description of where the request is coming from (e.g., "Home Page Contact Popup", "Footer Contact Form")
 * @returns {Promise<Object>} - Response object with status and message
 */
export const sendContactForm = async (formData, requestFrom = 'Website Contact Form') => {
  const pageUrl = window.location.href;
  
  // Normalize phone field (some forms use 'phone', others use 'mobile')
  const phone = formData.phone || formData.mobile || '';
  
  const payload = {
    name: (formData.name || '').trim(),
    email: (formData.email || '').trim(),
    phone: phone.trim(),
    request_from: requestFrom,
    page_url: pageUrl,
  };

  try {
    const res = await fetch('https://seagreen-porcupine-656193.hostingersite.com/mail.php', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // PHP returns JSON response
    const data = await res.json().catch(async () => {
      // If JSON parsing fails, try to get text response
      const text = await res.text();
      throw new Error(text || 'Failed to parse response');
    });

    // Check response status
    if (data.status === 'success') {
      return {
        success: true,
        message: data.message || "Thank you! We'll contact you soon.",
      };
    } else {
      throw new Error(data.message || 'Failed to send email. Please try again.');
    }
  } catch (err) {
    console.error('Contact form error:', err);
    return {
      success: false,
      message: err.message || 'Failed to submit. Please try again.',
    };
  }
};

