import Link from 'next/link';

interface Service {
  name: string;
  icon: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/lawn-care?service=${service.name.toLowerCase().replace(' ', '-')}`}
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-4xl mb-4">{service.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
        {service.name}
      </h3>
      <p className="mt-2 text-sm text-gray-600">{service.description}</p>
    </Link>
  );
}
