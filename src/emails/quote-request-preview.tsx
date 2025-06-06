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

interface QuoteRequestEmailProps {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  providerId?: string;
}

export const QuoteRequestEmail = ({
  name = 'John Smith',
  email = 'john@example.com',
  phone = '(555) 123-4567',
  message = 'I need lawn mowing service for a medium-sized yard. Looking for weekly service starting next month.',
  providerId = 'PROV-123456',
}: QuoteRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>New Quote Request from Lawn Care Directory</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/images/logo.svg`}
          width="115"
          height="48"
          alt="Lawn Care Directory Logo"
          style={{ margin: '0 auto', display: 'block' }}
        />
        <Heading style={h1}>New Quote Request</Heading>
        <Text style={text}>
          You have received a new quote request from a potential customer through Lawn Care Directory.
          Please review the details below:
        </Text>
        
        <Section style={quoteDetails}>
          <Text style={detailLabel}>Customer Name:</Text>
          <Text style={detailValue}>{name}</Text>
          
          <Text style={detailLabel}>Contact Information:</Text>
          <Text style={detailValue}>
            Email: <Link href={`mailto:${email}`} style={link}>{email}</Link><br />
            Phone: {phone || 'Not provided'}
          </Text>
          
          <Text style={detailLabel}>Provider ID:</Text>
          <Text style={detailValue}>{providerId}</Text>
          
          <Text style={detailLabel}>Request Details:</Text>
          <Text style={detailValue}>{message}</Text>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={text}>
          <strong>Please Note:</strong> Responding promptly to quote requests can significantly 
          increase your booking rate. Customers typically reach out to multiple providers, so a quick 
          response gives you an advantage.
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          This request was sent through the Lawn Care Directory platform. If you have any questions, 
          please contact provider support at
          <Link href="mailto:providers@fllawnnetwork.com" style={link}> providers@fllawnnetwork.com</Link>.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} Lawn Care Directory. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

QuoteRequestEmail.PreviewProps = {
  name: 'John Smith',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  message: 'I need lawn mowing service for a medium-sized yard. Looking for weekly service starting next month.',
  providerId: 'PROV-123456',
} as QuoteRequestEmailProps;

export default QuoteRequestEmail;

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

const quoteDetails = {
  margin: '20px 0',
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  padding: '20px',
};

const detailLabel = {
  color: '#666',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '8px 0 4px',
};

const detailValue = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 16px',
  lineHeight: '24px',
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