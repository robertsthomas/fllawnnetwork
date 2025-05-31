import DirectoryContent from '~/components/DirectoryContent';
import type { Metadata } from 'next';

const serviceDescriptions: { [key: string]: string } = {
  'pest-control': 'Find qualified pest control professionals for your lawn and garden.',
  'tree-trimming':
    'Connect with expert tree trimming services to keep your trees healthy and beautiful.',
  'garden-design': 'Discover talented garden designers to create your dream outdoor space.',
  fertilization: 'Locate fertilization services to nourish your lawn and promote healthy growth.',
  landscaping: "Explore landscaping services to enhance your property's curb appeal.",
  irrigation: 'Find irrigation specialists to ensure your lawn and garden are properly watered.',
  'leaf-removal': 'Get help with leaf removal to keep your yard clean and tidy.',
  'tree-services': 'Browse comprehensive tree services for all your arbor care needs.',
  'weed-control': 'Find effective weed control solutions to keep your lawn weed-free.',
  'lawn-mowing': 'Connect with professional lawn mowing services for a perfectly manicured yard.',
};

const defaultDescription =
  'Find qualified lawn care professionals and services in your area. Get quotes for mowing, fertilization, pest control, and more.';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const service = searchParams.service as string | undefined;
  const description =
    service && serviceDescriptions[service] ? serviceDescriptions[service] : defaultDescription;

  const title =
    service && serviceDescriptions[service]
      ? `${service
          .replace(/-/g, ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')} | Lawn Care Network`
      : 'Lawn Care Services | Find Local Professionals';

  return {
    title: title,
    description: description,
    alternates: {
      canonical: '/lawn-care',
    },
  };
}

export default function LawnCarePage() {
  return <DirectoryContent />;
}
