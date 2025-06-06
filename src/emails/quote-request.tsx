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

interface QuoteRequestEmailProps {
  providerName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  propertyAddress?: string;
  serviceType?: string;
  requestNotes?: string;
  requestId?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const QuoteRequestEmail = ({
  providerName = 'Lawn Care Provider',
  customerName = 'John Doe',
  customerEmail = 'customer@example.com',
  customerPhone = '(555) 123-4567',
  propertyAddress = '123 Main St, City, FL 32123',
  serviceType = 'Lawn Mowing',
  requestNotes = 'Please provide a quote for bi-weekly lawn mowing service.',
  requestId = '12345',
}: QuoteRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>New Quote Request: {serviceType}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="150"
          height="150"
          alt="Lawn Care Directory Logo"
          style={{ margin: '0 auto', display: 'block' }}
        />
        <Heading style={h1}>New Quote Request</Heading>
        <Text style={text}>
          Hello {providerName},
        </Text>
        <Text style={text}>
          You have received a new quote request from a potential customer through Lawn Care Directory.
          Please review the details below and respond to the customer as soon as possible.
        </Text>
        
        <Section style={quoteDetails}>
          <Heading as="h2" style={h2}>Request Details</Heading>
          
          <Text style={detailLabel}>Service Requested:</Text>
          <Text style={detailValue}>{serviceType}</Text>
          
          <Text style={detailLabel}>Customer Name:</Text>
          <Text style={detailValue}>{customerName}</Text>
          
          <Text style={detailLabel}>Contact Information:</Text>
          <Text style={detailValue}>
            Email: <Link href={`mailto:${customerEmail}`} style={link}>{customerEmail}</Link><br />
            Phone: {customerPhone}
          </Text>
          
          <Text style={detailLabel}>Property Address:</Text>
          <Text style={detailValue}>{propertyAddress}</Text>
          
          <Text style={detailLabel}>Additional Notes:</Text>
          <Text style={detailValue}>{requestNotes}</Text>
        </Section>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${baseUrl}/provider/quotes/${requestId}`}
          >
            Respond to Request
          </Button>
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
          <Link href="mailto:providers@lawncare-directory.com" style={link}> providers@lawncare-directory.com</Link>.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} Lawn Care Directory. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

QuoteRequestEmail.PreviewProps = {
  providerName: 'Green Lawn Solutions',
  customerName: 'John Smith',
  customerEmail: 'john.smith@example.com',
  customerPhone: '(555) 987-6543',
  propertyAddress: '456 Oak Avenue, Tampa, FL 33601',
  serviceType: 'Lawn Mowing and Edging',
  requestNotes: 'Looking for weekly service. Have a medium-sized yard (approx. 1/4 acre) with some garden beds that need to be worked around.',
  requestId: 'REQ-12345',
} as QuoteRequestEmailProps;

export default QuoteRequestEmail;

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

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 10px',
  padding: '0',
  borderBottom: '1px solid #eaeaea',
  paddingBottom: '8px',
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