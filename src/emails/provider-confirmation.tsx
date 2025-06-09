import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ProviderConfirmationEmailProps {
  providerName?: string;
  providerEmail?: string;
  profileUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ProviderConfirmationEmail = ({
  providerName = 'Lawn Care Provider',
  providerEmail = 'provider@example.com',
  profileUrl = '/',
}: ProviderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Lawn Care Directory Provider Profile is Confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="150"
          height="150"
          alt="Lawn Care Directory Logo"
          style={{ margin: '0 auto', display: 'block' }}
        />
        <Heading style={h1}>Provider Registration Confirmed</Heading>
        <Text style={text}>
          Hello {providerName},
        </Text>
        <Text style={text}>
          Congratulations! Your provider profile on the Lawn Care Directory has been approved and is now live.
          Customers in your service area can now view your profile, services, and reviews.
        </Text>
        <Section style={bulletPoints}>
          <Text style={listItem}>✅ Your business email: {providerEmail}</Text>
          <Text style={listItem}>✅ Your profile is now searchable by customers</Text>
          <Text style={listItem}>✅ You can now receive service requests</Text>
          <Text style={listItem}>✅ You can update your profile and services anytime</Text>
        </Section>
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${baseUrl}${profileUrl}`}
          >
            View Your Profile
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={text}>
          <strong>Next Steps:</strong>
        </Text>
        <Text style={text}>
          1. Ensure your service offerings and pricing are up to date<br />
          2. Add photos of your work to showcase your quality<br />
          3. Encourage satisfied customers to leave reviews<br />
          4. Set your availability for booking
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you have any questions or need assistance, please don't hesitate to contact our provider support team at
          <Link href="mailto:providers@lawncare-directory.com" style={link}> providers@lawncare-directory.com</Link>.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} Lawn Care Directory. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

ProviderConfirmationEmail.PreviewProps = {
  providerName: 'Green Lawn Solutions',
  providerEmail: 'contact@greenlawnsolutions.com',
  profileUrl: '/providers/green-lawn-solutions',
} as ProviderConfirmationEmailProps;

export default ProviderConfirmationEmail;

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const bulletPoints = {
  margin: '20px 0',
};

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '10px 0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#22c55e',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 24px',
  textAlign: 'center' as const,
  display: 'inline-block',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '26px 0',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  margin: '12px 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#22c55e',
  textDecoration: 'underline',
}; 