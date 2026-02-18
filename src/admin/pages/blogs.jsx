import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';
const BLOGS_API_ENDPOINT = '/api/admin/blogs';

const Blogs = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: null,
    featured_image_alt: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: null,
    og_image_alt: '',
    schema_type: 'Article',
    schema_json: '',
    author: '',
    status: 'draft',
    published_at: '',
    category: '',
    tags: '',
  });
  const [editorInstance, setEditorInstance] = useState(null);
  const editorRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Initialize CKEditor
  useEffect(() => {
    if (!showForm || !editorRef.current || editorInstance) return;

    // Wait for CKEditor script to load
    const initEditor = () => {
      if (window.ClassicEditor && editorRef.current) {
        window.ClassicEditor
          .create(editorRef.current, {
            toolbar: {
              items: [
                'heading', '|',
                'bold', 'italic', 'link', '|',
                'bulletedList', 'numberedList', '|',
                'outdent', 'indent', '|',
                'blockQuote', 'insertTable', '|',
                'imageUpload', 'mediaEmbed', '|',
                'undo', 'redo', '|',
                'sourceEditing'
              ],
              shouldNotGroupWhenFull: true
            },
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              ]
            },
            placeholder: 'Start writing your blog post...',
          })
          .then(editor => {
            setEditorInstance(editor);
            // Set initial content if editing
            if (form.content) {
              editor.setData(form.content);
            }
            editor.model.document.on('change:data', () => {
              setForm(prev => ({ ...prev, content: editor.getData() }));
            });
          })
          .catch(error => {
            console.error('Error initializing CKEditor:', error);
            setMessage({ type: 'error', text: 'Failed to load editor. Please refresh the page.' });
          });
      } else {
        // Retry after a short delay if script not loaded yet
        setTimeout(initEditor, 100);
      }
    };

    initEditor();

    return () => {
      if (editorInstance) {
        editorInstance.destroy().catch(() => {});
        setEditorInstance(null);
      }
    };
  }, [showForm]);

  // Update editor content when form.content changes (for editing)
  useEffect(() => {
    if (editorInstance && form.content && editingId) {
      const currentContent = editorInstance.getData();
      if (currentContent !== form.content) {
        editorInstance.setData(form.content);
      }
    }
  }, [form.content, editingId, editorInstance]);

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !editingId) {
      const slug = form.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  }, [form.title, editingId]);

  // Protect page: require admin session
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.status === 401 || res.status === 403) {
          navigate('/admin/login');
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setMessage({ type: 'error', text: data.message || 'Unable to verify session.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Unable to reach server to verify session.' });
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAdmin();
  }, [navigate]);

  // Fetch blogs list
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${BLOGS_API_ENDPOINT}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to load blogs');
      }
      const data = await res.json();
      const blogsArray = Array.isArray(data) ? data : (data.blogs || data.data || []);
      setBlogs(blogsArray);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth) {
      fetchBlogs();
    }
  }, [checkingAuth]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setMessage({ type: '', text: '' });
  };

  const handleFileChange = (fieldName) => (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleSchemaChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, schema_type: value }));
    
    // Generate default schema JSON based on type
    if (value === 'Article') {
      setForm(prev => ({
        ...prev,
        schema_json: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": prev.title || "",
          "description": prev.meta_description || "",
          "image": "",
          "author": {
            "@type": "Person",
            "name": prev.author || ""
          },
          "datePublished": prev.published_at || new Date().toISOString(),
          "publisher": {
            "@type": "Organization",
            "name": "Ameya Group"
          }
        }, null, 2)
      }));
    } else if (value === 'BlogPosting') {
      setForm(prev => ({
        ...prev,
        schema_json: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": prev.title || "",
          "description": prev.meta_description || "",
          "image": "",
          "author": {
            "@type": "Person",
            "name": prev.author || ""
          },
          "datePublished": prev.published_at || new Date().toISOString(),
          "publisher": {
            "@type": "Organization",
            "name": "Ameya Group"
          }
        }, null, 2)
      }));
    }
  };

  const handleSchemaJsonChange = (e) => {
    setForm((prev) => ({ ...prev, schema_json: e.target.value }));
  };

  const validateSchemaJson = () => {
    if (!form.schema_json.trim()) return true;
    try {
      JSON.parse(form.schema_json);
      return true;
    } catch {
      return false;
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: null,
      featured_image_alt: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: null,
      og_image_alt: '',
      schema_type: 'Article',
      schema_json: '',
      author: '',
      status: 'draft',
      published_at: '',
      category: '',
      tags: '',
    });
    if (editorInstance) {
      editorInstance.setData('');
    }
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate schema JSON
    if (form.schema_json && !validateSchemaJson()) {
      setMessage({ type: 'error', text: 'Invalid JSON in Schema JSON field. Please check the format.' });
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      
      // Text fields
      fd.append('title', form.title);
      fd.append('slug', form.slug);
      fd.append('content', form.content);
      fd.append('excerpt', form.excerpt);
      fd.append('featured_image_alt', form.featured_image_alt);
      fd.append('meta_title', form.meta_title);
      fd.append('meta_description', form.meta_description);
      fd.append('meta_keywords', form.meta_keywords);
      fd.append('og_title', form.og_title);
      fd.append('og_description', form.og_description);
      fd.append('og_image_alt', form.og_image_alt);
      fd.append('schema_type', form.schema_type);
      fd.append('schema_json', form.schema_json);
      fd.append('author', form.author);
      fd.append('status', form.status);
      fd.append('published_at', form.published_at);
      fd.append('category', form.category);
      fd.append('tags', form.tags);

      // Image files
      if (form.featured_image) {
        fd.append('featured_image', form.featured_image);
      }
      if (form.og_image) {
        fd.append('og_image', form.og_image);
      }

      const url = editingId 
        ? `${API_BASE}${BLOGS_API_ENDPOINT}/${editingId}`
        : `${API_BASE}${BLOGS_API_ENDPOINT}`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save blog');
      }

      setMessage({ type: 'success', text: editingId ? 'Blog updated successfully!' : 'Blog created successfully!' });
      resetForm();
      fetchBlogs();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save blog.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${BLOGS_API_ENDPOINT}/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to load blog');
      }
      const data = await res.json();
      const blog = data.blog || data;
      
      setForm({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        featured_image: null,
        featured_image_alt: blog.featured_image_alt || '',
        meta_title: blog.meta_title || '',
        meta_description: blog.meta_description || '',
        meta_keywords: blog.meta_keywords || '',
        og_title: blog.og_title || '',
        og_description: blog.og_description || '',
        og_image: null,
        og_image_alt: blog.og_image_alt || '',
        schema_type: blog.schema_type || 'Article',
        schema_json: blog.schema_json || '',
        author: blog.author || '',
        status: blog.status || 'draft',
        published_at: blog.published_at || '',
        category: blog.category || '',
        tags: blog.tags || '',
      });
      
      // Editor will be initialized in useEffect and will pick up form.content
      
      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to load blog' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}${BLOGS_API_ENDPOINT}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to delete blog');
      }
      setMessage({ type: 'success', text: 'Blog deleted successfully!' });
      fetchBlogs();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete blog' });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 md:flex-shrink-0 md:h-screen md:sticky md:top-0">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-10 md:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Blog Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create, edit, and manage blog posts with SEO optimization
                </p>
              </div>
              {!showForm && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                  + New Blog Post
                </button>
              )}
              {showForm && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Back to List
                </button>
              )}
            </div>

            {message.text && (
              <div
                className={`mb-6 rounded-md px-4 py-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            {showForm ? (
              <form
                className="bg-white shadow rounded-lg p-6 space-y-8"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {/* Basic Information Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blog Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter blog title"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-2">(Auto-generated from title)</span>
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="blog-post-url-slug"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt/Short Description
                      </label>
                      <textarea
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        rows="3"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Brief description of the blog post (used in listings)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Author name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="e.g., Real Estate, News"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags <span className="text-xs text-gray-500">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Published Date
                      </label>
                      <input
                        type="datetime-local"
                        name="published_at"
                        value={form.published_at}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Featured Image Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange('featured_image')}
                        className="w-full text-sm text-gray-700"
                      />
                      {form.featured_image && (
                        <p className="text-xs text-gray-600 mt-1">Selected: {form.featured_image.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Alt Text <span className="text-xs text-gray-500">(for SEO)</span>
                      </label>
                      <input
                        type="text"
                        name="featured_image_alt"
                        value={form.featured_image_alt}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Descriptive alt text for the image"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Editor Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog Content <span className="text-red-500">*</span></h2>
                  <div className="ckeditor-container">
                    <div ref={editorRef} className="min-h-[400px]"></div>
                  </div>
                  <style>{`
                    .ckeditor-container .ck-editor__editable {
                      min-height: 400px;
                    }
                    .ckeditor-container .ck-content {
                      min-height: 400px;
                    }
                  `}</style>
                </div>

                {/* SEO Meta Tags Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Meta Tags</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 50-60 characters)</span>
                      </label>
                      <input
                        type="text"
                        name="meta_title"
                        value={form.meta_title}
                        onChange={handleChange}
                        maxLength={60}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="SEO meta title"
                      />
                      <p className="text-xs text-gray-500 mt-1">{form.meta_title.length}/60 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 150-160 characters)</span>
                      </label>
                      <textarea
                        name="meta_description"
                        value={form.meta_description}
                        onChange={handleChange}
                        rows="3"
                        maxLength={160}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="SEO meta description"
                      />
                      <p className="text-xs text-gray-500 mt-1">{form.meta_description.length}/160 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Keywords <span className="text-xs text-gray-500">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        name="meta_keywords"
                        value={form.meta_keywords}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </div>

                {/* Open Graph Tags Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Open Graph Tags (Social Media)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Title
                      </label>
                      <input
                        type="text"
                        name="og_title"
                        value={form.og_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Title for social media sharing"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Description
                      </label>
                      <textarea
                        name="og_description"
                        value={form.og_description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Description for social media sharing"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange('og_image')}
                          className="w-full text-sm text-gray-700"
                        />
                        {form.og_image && (
                          <p className="text-xs text-gray-600 mt-1">Selected: {form.og_image.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Image Alt Text
                        </label>
                        <input
                          type="text"
                          name="og_image_alt"
                          value={form.og_image_alt}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="Alt text for OG image"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schema.org JSON-LD Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Schema.org JSON-LD</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schema Type
                      </label>
                      <select
                        name="schema_type"
                        value={form.schema_type}
                        onChange={handleSchemaChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      >
                        <option value="Article">Article</option>
                        <option value="BlogPosting">BlogPosting</option>
                        <option value="NewsArticle">NewsArticle</option>
                        <option value="WebPage">WebPage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schema JSON <span className="text-xs text-gray-500">(JSON-LD format)</span>
                        {form.schema_json && !validateSchemaJson() && (
                          <span className="text-red-500 ml-2">⚠ Invalid JSON</span>
                        )}
                      </label>
                      <textarea
                        name="schema_json"
                        value={form.schema_json}
                        onChange={handleSchemaJsonChange}
                        rows="12"
                        className={`w-full rounded-md border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 ${
                          form.schema_json && !validateSchemaJson()
                            ? 'border-red-300 focus:ring-red-600 focus:border-red-600'
                            : 'border-gray-300 focus:ring-blue-600 focus:border-blue-600'
                        }`}
                        placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter valid JSON-LD structured data. Leave empty to use default schema.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (form.schema_json && !validateSchemaJson())}
                    className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Blog' : 'Publish Blog'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Blogs List */}
                {loading ? (
                  <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                    Loading blogs...
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="bg-white shadow rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">No blogs found.</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
                      className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
                    >
                      Create Your First Blog
                    </button>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Author
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Published
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {blogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                              <div className="text-xs text-gray-500">{blog.slug}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {blog.author || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                  blog.status === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {blog.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {blog.published_at
                                ? new Date(blog.published_at).toLocaleDateString()
                                : 'Not published'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(blog.id)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(blog.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Blogs;

