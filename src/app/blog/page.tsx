import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import SearchBar from '~/components/blog/SearchBar'

export const metadata: Metadata = {
  title: "Lawn Care Blog | Tips, Tricks, and Expert Advice",
  description: "Expert lawn care tips, seasonal guides, and professional advice to help you maintain a beautiful, healthy lawn all year round.",
  alternates: {
    canonical: '/blog',
  },
}

const blogPosts = [
  {
    slug: "spring-lawn-care-guide",
    title: "Spring Lawn Care Guide: Getting Your Yard Ready for Summer",
    excerpt: "Learn essential spring lawn care tips to ensure your yard thrives throughout the summer months.",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2070",
    date: "2024-03-15",
    category: "Seasonal Care",
    author: "John Smith",
    readTime: "8 min read",
  },
  {
    slug: "watering-tips",
    title: "Smart Watering: How to Keep Your Lawn Hydrated Without Waste",
    excerpt: "Discover efficient watering techniques that will keep your lawn green while conserving water.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070",
    date: "2024-03-10",
    category: "Watering",
    author: "Sarah Johnson",
    readTime: "6 min read",
  },
  {
    slug: "lawn-mowing-techniques",
    title: "Professional Lawn Mowing Techniques for a Perfect Cut",
    excerpt: "Master the art of lawn mowing with these professional techniques for a perfectly manicured lawn.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070",
    date: "2024-03-05",
    category: "Maintenance",
    author: "Mike Wilson",
    readTime: "10 min read",
  },
]

const categories = [
  { name: 'All', count: 3 },
  { name: 'Seasonal Care', count: 1 },
  { name: 'Watering', count: 1 },
  { name: 'Maintenance', count: 1 },
]

export default function BlogPage() {
  // Generate schema markup for the blog
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Lawn Care Blog",
    "description": "Expert lawn care tips, seasonal guides, and professional advice to help you maintain a beautiful, healthy lawn all year round.",
    "url": "https://www.fllawnnetwork.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Florida Lawn Network",
      "url": "https://www.fllawnnetwork.com"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "url": `https://www.fllawnnetwork.com/blog/${post.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Lawn Care Blog
            </h1>
            <p className="mt-4 text-xl text-primary-100">
              Expert tips, seasonal guides, and professional advice for a beautiful lawn
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Search and Categories */}
              <div className="mb-8 space-y-4">
                <SearchBar />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span className="text-primary-600">{post.category}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.author}</span>
                        <span className="text-sm text-gray-500">{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Popular Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-500">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Services */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services</h3>
                <div className="space-y-2">
                  <Link href="/services/lawn-care" className="block text-sm text-gray-700 hover:text-primary-600">
                    Lawn Care Services
                  </Link>
                  <Link href="/services/landscaping" className="block text-sm text-gray-700 hover:text-primary-600">
                    Landscaping Services
                  </Link>
                  <Link href="/services/tree-services" className="block text-sm text-gray-700 hover:text-primary-600">
                    Tree Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 