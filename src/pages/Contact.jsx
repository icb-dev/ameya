import React, { useState } from "react";
import KeywordsDisplay from "../components/KeywordsDisplay";
import { sendContactForm } from "../utils/contactForm";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const result = await sendContactForm(formData, 'Contact Page Form');

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setFormData({ name: '', email: '', phone: '' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setSubmitting(false);
  };

  return (
    <main className="pt-20 md:pt-24 bg-white">
      {/* Hero Image */}
      <section className="w-full">
        <img
          src="/img/contact.jpg"
          alt="Contact Ameya"
          className="w-full h-[260px] md:h-[360px] lg:h-[420px] object-cover"
        />
      </section>

      {/* Breadcrumb */}
      <section className="w-[90%] md:w-[70%] mx-auto py-6 md:py-8 border-b border-gray-200">
        <p className="text-xs md:text-sm tracking-[0.25em] text-gray-500 uppercase">
          <span className="text-blue-600">Home</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-700">Contact Us</span>
        </p>
      </section>

      {/* Contact Content */}
      <section className="w-[90%] md:w-[70%] mx-auto py-10 md:py-16">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <div className="w-16 h-[3px] bg-red-700 mx-auto mb-4" />
          <h1 className="text-lg md:text-2xl tracking-[0.4em] font-semibold text-gray-800 uppercase">
            Contact Us
          </h1>
        </div>

        {/* Contact Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center md:text-left mb-16">
          {/* Talk */}
          <div>
            <h3 className="text-xs md:text-sm tracking-[0.25em] text-gray-600 uppercase mb-4">
              Talk
            </h3>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              +91-124-2571477
              <br />
              +91-124-2572477
            </p>
          </div>

          {/* Meet */}
          <div>
            <h3 className="text-xs md:text-sm tracking-[0.25em] text-gray-600 uppercase mb-4">
              Meet
            </h3>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              <span className="font-semibold">Ameya Group</span>
              <br />
              Ameya One, DLF – V,
              <br />
              Golf Course Road,
              <br />
              Gurgaon – 122002,
              <br />
              Haryana, India
            </p>
          </div>

          {/* Write */}
          <div>
            <h3 className="text-xs md:text-sm tracking-[0.25em] text-gray-600 uppercase mb-4">
              Write
            </h3>
            <a
              href="mailto:sales@ameyagroup.in"
              className="text-sm md:text-base text-gray-800 leading-relaxed hover:text-orange-600 transition-colors"
            >
              sales@ameyagroup.in
            </a>
          </div>

          {/* Sales Enquiry */}
          <div>
            <h3 className="text-xs md:text-sm tracking-[0.25em] text-gray-600 uppercase mb-4">
              Sales Enquiry
            </h3>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              +91-9711004269
              <br />
              +91-9711004259
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="text-center mb-8">
            <div className="w-16 h-[3px] bg-red-700 mx-auto mb-4" />
            <h2 className="text-lg md:text-xl tracking-[0.3em] font-semibold text-gray-800 uppercase">
              Send Us a Message
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name*"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone*"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent disabled:opacity-50"
              />
            </div>
            {message.text && (
              <div
                className={`text-sm px-4 py-3 rounded-md ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-red-700 text-white font-semibold uppercase tracking-wide rounded-md hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </form>
        </div>
      </section>

      {/* Keywords Display */}
      <KeywordsDisplay />
    </main>
  );
  
};

export default Contact;


