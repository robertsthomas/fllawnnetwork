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
import { render } from '@react-email/render';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

// Welcome Email Template
interface WelcomeEmailProps {
  name: string;
  email: string;
}

export function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Lawn Care Directory</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/images/logo.svg`}
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
}

// Provider Confirmation Email Template
interface ProviderConfirmationEmailProps {
  name: string;
  email: string;
  providerId: string;
}

export function ProviderConfirmationEmail({ 
  name, 
  email, 
  providerId 
}: ProviderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Lawn Care Directory Provider Profile is Confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/images/logo.svg`}
            width="115"
            height="48"
            alt="Lawn Care Directory Logo"
            style={{ margin: '0 auto', display: 'block' }}
          />
          <Heading style={h1}>Provider Registration Confirmed</Heading>
          <Text style={text}>
            Hello {name},
          </Text>
          <Text style={text}>
            Congratulations! Your provider profile on the Lawn Care Directory has been approved and is now live.
            Customers in your service area can now view your profile, services, and reviews.
          </Text>
          <Section style={bulletPoints}>
            <Text style={listItem}>✅ Your business email: {email}</Text>
            <Text style={listItem}>✅ Your profile is now searchable by customers</Text>
            <Text style={listItem}>✅ You can now receive service requests</Text>
            <Text style={listItem}>✅ You can update your profile and services anytime</Text>
          </Section>
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${baseUrl}/providers/${providerId}`}
            >
              View Your Profile
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If you have any questions or need assistance, please don't hesitate to contact our provider support team at
            <Link href="mailto:providers@fllawnnetwork.com" style={link}> providers@fllawnnetwork.com</Link>.
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} Lawn Care Directory. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Quote Request Email Template
interface QuoteRequestEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
  providerId: string;
}

export function QuoteRequestEmail({ 
  name, 
  email, 
  phone, 
  message, 
  providerId 
}: QuoteRequestEmailProps) {
  return (
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
            increase your booking rate. 
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
}

// Business Claim Email Template
interface BusinessClaimEmailProps {
  name: string;
  email: string;
  phone: string;
  verificationInfo: string;
  providerId: string;
}

export function BusinessClaimEmail({ 
  name, 
  email, 
  phone, 
  verificationInfo, 
  providerId 
}: BusinessClaimEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Business Claim Request</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/images/logo.svg`}
            width="115"
            height="48"
            alt="Lawn Care Directory Logo"
            style={{ margin: '0 auto', display: 'block' }}
          />
          <Heading style={h1}>New Business Claim Request</Heading>
          
          <Section style={quoteDetails}>
            <Text style={detailLabel}>Name:</Text>
            <Text style={detailValue}>{name}</Text>
            
            <Text style={detailLabel}>Contact Information:</Text>
            <Text style={detailValue}>
              Email: <Link href={`mailto:${email}`} style={link}>{email}</Link><br />
              Phone: {phone || 'Not provided'}
            </Text>
            
            <Text style={detailLabel}>Provider ID:</Text>
            <Text style={detailValue}>{providerId}</Text>
            
            <Text style={detailLabel}>Verification Information:</Text>
            <Text style={detailValue}>{verificationInfo}</Text>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            This request was sent through the Lawn Care Directory platform. 
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} Lawn Care Directory. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Render email templates to HTML
export async function renderWelcomeEmail(props: WelcomeEmailProps): Promise<string> {
  return render(<WelcomeEmail {...props} />);
}

export async function renderProviderConfirmationEmail(props: ProviderConfirmationEmailProps): Promise<string> {
  return render(<ProviderConfirmationEmail {...props} />);
}

export async function renderQuoteRequestEmail(props: QuoteRequestEmailProps): Promise<string> {
  return render(<QuoteRequestEmail {...props} />);
}

export async function renderBusinessClaimEmail(props: BusinessClaimEmailProps): Promise<string> {
  return render(<BusinessClaimEmail {...props} />);
}

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