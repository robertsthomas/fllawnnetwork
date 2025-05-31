import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import SocialShare from '~/components/blog/SocialShare'
import RelatedPosts from '~/components/blog/RelatedPosts'

type BlogContent = {
  type: "heading" | "paragraph" | "list"
  text?: string
  items?: string[]
  id: string
}

type BlogPost = {
  slug: string
  title: string
  content: BlogContent[]
  image: string
  date: string
  category: string
}

const blogPosts: Record<string, BlogPost> = {
  "spring-lawn-care-guide": {
    slug: "spring-lawn-care-guide",
    title: "Spring Lawn Guide",
    content: [
      {
        type: "paragraph" as const,
        text: "Spring is the perfect time to give your lawn the attention it needs after the winter months. With the right care and maintenance, you can ensure your yard thrives throughout the summer.",
        id: "intro",
      },
      {
        type: "heading" as const,
        text: "1. Clean Up and Rake",
        id: "cleanup",
      },
      {
        type: "paragraph" as const,
        text: "Start by removing any debris, dead leaves, and branches that have accumulated over winter. Raking helps remove thatch and allows air and water to reach the soil.",
        id: "cleanup-desc",
      },
      {
        type: "heading" as const,
        text: "2. Aerate Your Lawn",
        id: "aerate",
      },
      {
        type: "paragraph" as const,
        text: "Aeration helps relieve soil compaction and allows nutrients, water, and air to reach the roots. Use a core aerator for best results.",
        id: "aerate-desc",
      },
      {
        type: "heading" as const,
        text: "3. Apply Fertilizer",
        id: "fertilize",
      },
      {
        type: "paragraph" as const,
        text: "Choose a spring fertilizer with a balanced ratio of nitrogen, phosphorus, and potassium. Apply it evenly across your lawn for optimal growth.",
        id: "fertilize-desc",
      },
    ],
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2070",
    date: "March 15, 2024",
    category: "Seasonal Care",
  },
  "watering-tips": {
    slug: "watering-tips",
    title: "Smart Watering Guide",
    content: [
      {
        type: "paragraph" as const,
        text: "Proper watering is essential for a healthy lawn, but it's important to do it efficiently to conserve water and prevent issues like disease and shallow root growth.",
        id: "intro",
      },
      {
        type: "heading" as const,
        text: "Best Time to Water",
        id: "timing",
      },
      {
        type: "paragraph" as const,
        text: "Water your lawn early in the morning, ideally between 4 AM and 8 AM. This allows the water to soak in before the heat of the day and reduces evaporation.",
        id: "timing-desc",
      },
      {
        type: "heading" as const,
        text: "Watering Frequency",
        id: "frequency",
      },
      {
        type: "paragraph" as const,
        text: "Most lawns need about 1 inch of water per week, including rainfall. Water deeply but infrequently to encourage deep root growth.",
        id: "frequency-desc",
      },
      {
        type: "heading" as const,
        text: "Signs of Overwatering",
        id: "overwatering",
      },
      {
        type: "list" as const,
        items: [
          "Spongy feel when walking on the lawn",
          "Excessive thatch",
          "Fungal growth",
          "Yellowing grass",
        ],
        id: "overwatering-signs",
      },
    ],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070",
    date: "March 10, 2024",
    category: "Watering",
  },
  "lawn-mowing-techniques": {
    slug: "lawn-mowing-techniques",
    title: "Techniques for a Perfect Cut",
    content: [
      {
        type: "paragraph" as const,
        text: "Proper mowing techniques are crucial for maintaining a healthy, attractive lawn. Follow these professional tips to achieve the perfect cut every time.",
        id: "intro",
      },
      {
        type: "heading" as const,
        text: "Mowing Height",
        id: "height",
      },
      {
        type: "paragraph" as const,
        text: "Keep your grass at the optimal height for its type. Most cool-season grasses should be kept at 2.5-3.5 inches, while warm-season grasses can be shorter.",
        id: "height-desc",
      },
      {
        type: "heading" as const,
        text: "Mowing Pattern",
        id: "pattern",
      },
      {
        type: "paragraph" as const,
        text: "Alternate your mowing pattern each time to prevent soil compaction and ensure even growth. Try mowing in different directions each week.",
        id: "pattern-desc",
      },
      {
        type: "heading" as const,
        text: "Mowing Tips",
        id: "tips",
      },
      {
        type: "list" as const,
        items: [
          "Never remove more than 1/3 of the grass blade length",
          "Keep mower blades sharp for clean cuts",
          "Mow when the grass is dry",
          "Leave grass clippings on the lawn for natural fertilizer",
        ],
        id: "tips-list",
      },
    ],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070",
    date: "March 5, 2024",
    category: "Maintenance",
  },
}

function BlogContent({ content }: { content: BlogContent[] }) {
  return (
    <div className="prose prose-lg max-w-none">
      {content.map((section) => {
        if (section.type === "heading") {
          return <h2 key={section.id} className="text-2xl font-bold mt-8 mb-4">{section.text}</h2>
        }
        if (section.type === "paragraph") {
          return <p key={section.id} className="mb-4">{section.text}</p>
        }
        if (section.type === "list") {
          return (
            <ul key={section.id} className="list-disc pl-6 mb-4">
              {section.items?.map((item) => (
                <li key={`${section.id}-${item}`}>{item}</li>
              ))}
            </ul>
          )
        }
        return null
      })}
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]
  if (!post) return { title: "Blog Post Not Found" }

  return {
    title: `${post.title} | Lawn Care Blog`,
    description: post.content[0].text,
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]
  
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <Link
                href="/blog"
                className="inline-flex items-center text-white hover:text-primary-200 transition-colors mb-4"
                aria-label="Back to blog"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center text-white">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-lg shadow-sm p-8">
              {post.content.map((item) => {
                switch (item.type) {
                  case "heading":
                    return (
                      <h2 key={item.id} className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                        {item.text}
                      </h2>
                    )
                  case "paragraph":
                    return (
                      <p key={item.id} className="text-gray-600 leading-relaxed mb-4">
                        {item.text}
                      </p>
                    )
                  case "list":
                    return (
                      <ul key={item.id} className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                        {item.items?.map((listItem) => (
                          <li key={`${item.id}-${listItem}`}>{listItem}</li>
                        ))}
                      </ul>
                    )
                  default:
                    return null
                }
              })}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <SocialShare
                  url={`https://yourdomain.com/blog/${post.slug}`}
                  title={post.title}
                />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <RelatedPosts
              currentSlug={post.slug}
              posts={Object.values(blogPosts)}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 