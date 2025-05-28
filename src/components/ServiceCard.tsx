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
      href={`/directory?service=${service.name.toLowerCase().replace(' ', '-')}`}
      className="block group"
    >
      <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] h-full">
        <div className="text-4xl mb-4">{service.icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {service.name}
        </h3>
        <p className="mt-2 text-sm text-gray-600">{service.description}</p>
      </div>
    </Link>
  );
}
