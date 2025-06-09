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

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

interface WelcomeEmailProps {
  name?: string;
  email?: string;
}

export const WelcomeEmail = ({
  name = 'John Smith',
  email = 'john@example.com',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the Lawn Care Directory</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="115"
          height="48"
          alt="Lawn Care Directory Logo"
          style={{ margin: '0 auto', display: 'block' }}
        />
        <Heading style={h1}>Welcome to the Lawn Care Directory</Heading>
        <Text style={text}>
          Hello {name},
        </Text>
        <Text style={text}>
          Thank you for joining the Lawn Care Directory! We're excited to help you find the perfect lawn care service 
          for your needs. With our platform, you can:
        </Text>
        <Section style={bulletPoints}>
          <Text style={listItem}>✅ Browse top-rated lawn care providers in your area</Text>
          <Text style={listItem}>✅ Read verified reviews from real customers</Text>
          <Text style={listItem}>✅ Compare services and prices easily</Text>
          <Text style={listItem}>✅ Book services directly through our platform</Text>
        </Section>
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={baseUrl}
          >
            Browse Providers Now
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          If you have any questions or need assistance, please don't hesitate to contact our support team at
          <Link href="mailto:support@fllawnnetwork.com" style={link}> support@fllawnnetwork.com</Link>.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} Lawn Care Directory. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  name: 'John Smith',
  email: 'john@example.com',
} as WelcomeEmailProps;

export default WelcomeEmail;

// Shared styles
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