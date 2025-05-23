import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: string;
  date: string;
}

interface TestimonialsProps {
  reviews: Review[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  // Get a subset of reviews for the homepage
  const featuredReviews = reviews.filter(review => review.rating >= 4).slice(0, 3);

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Real experiences from satisfied customers
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featuredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-md p-6 relative animate-fade-in">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 border-4 border-white">
                <span className="text-3xl">"</span>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="ml-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${i < review.rating ? 'text-accent-500' : 'text-gray-300'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote>
                <p className="text-gray-800 text-base leading-relaxed">"{review.comment}"</p>
              </blockquote>
              
              <p className="mt-4 text-sm font-medium text-gray-700">— {review.user}</p>
              <p className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href="/reviews" 
            className="text-primary-600 font-medium hover:text-primary-700 transition flex items-center justify-center"
          >
            See all reviews
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 