import Link from 'next/link';
import Image from 'next/image';

type Post = {
  slug: string;
  title: string;
  image: string;
  date: string;
};

type RelatedPostsProps = {
  currentSlug: string;
  posts: Post[];
};

export default function RelatedPosts({ currentSlug, posts }: RelatedPostsProps) {
  // Filter out the current post and get up to 3 related posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
      <div className="space-y-4">
        {relatedPosts.map((post) => (
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
                <p className="text-xs text-gray-500">{post.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 