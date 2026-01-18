import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  fullName: string;
}

export const WelcomeEmail = ({ fullName }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to WellNourish AI!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {fullName}!</Heading>
          <Text style={text}>
            We&apos;re excited to join you on your wellness journey. With WellNourish AI, you now have the power of personalized health planning at your fitness goals.
          </Text>
          <Section style={section}>
            <Text style={text}>
              To get started, complete your onboarding profile to generate your first personalized plan.
            </Text>
            <Button style={button} href="https://wellnourishai.in/onboarding">
              Go to Dashboard
            </Button>
          </Section>
          <Text style={footer}>
            Best regards,
            <br />
            The WellNourish AI Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  color: "#10b981", // Emerald-500
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
  margin: "20px 0",
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "22px",
  marginTop: "12px",
};
