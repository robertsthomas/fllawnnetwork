import ProviderRegistrationForm from '~/components/ProviderRegistrationForm';

export const metadata = {
  title: 'Register as a Provider | Lawn Care Directory',
  description: 'Join our network of lawn care professionals and connect with customers in your area.',
};

export default function ProviderRegistrationPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Join Our Provider Network</h1>
        <p className="text-center text-gray-600 mb-8">
          Register your lawn care business and start connecting with customers in your area.
        </p>
        
        <ProviderRegistrationForm />
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Why Join?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Grow Your Business</h3>
              <p className="text-gray-600">
                Reach new customers and expand your service area through our directory.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Easy Management</h3>
              <p className="text-gray-600">
                Manage your profile, services, and customer interactions all in one place.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Build Reputation</h3>
              <p className="text-gray-600">
                Collect reviews and ratings to showcase the quality of your work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
