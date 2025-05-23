import ServiceCard from './ServiceCard';

interface Service {
  name: string;
  icon: string;
  description: string;
}

interface ServicesListProps {
  services: Service[];
}

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Browse By Service
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Find the perfect professional for any lawn care or landscaping need
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {services.map(service => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
} 