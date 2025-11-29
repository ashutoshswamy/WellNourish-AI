import * as React from 'react';

interface WelcomeEmailProps {
  userName?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName }) => {
  const displayName = userName || 'there';
  
  return (
    <div style={{
      fontFamily: '"Trebuchet MS", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      backgroundColor: '#ffffff',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center' as const,
        marginBottom: '40px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#16a34a',
          margin: '0',
        }}>
          WellNourish AI
        </h1>
      </div>

      {/* Welcome Message */}
      <div style={{
        backgroundColor: '#f0fdf4',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '32px',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#166534',
          margin: '0 0 16px 0',
        }}>
          Welcome to WellNourish AI, {displayName}!
        </h2>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#374151',
          margin: '0',
        }}>
          We&apos;re thrilled to have you on board. Your journey to a healthier lifestyle starts now!
        </p>
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '20px',
        }}>
          Here&apos;s what you can do with WellNourish AI:
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ color: '#1f2937' }}>Personalized Meal Plans</strong>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Get AI-generated meal plans tailored to your dietary preferences and goals.
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong style={{ color: '#1f2937' }}>Custom Workout Plans</strong>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Receive workout routines designed to match your fitness level and goals.
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong style={{ color: '#1f2937' }}>Track Your Progress</strong>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Monitor your health journey and celebrate your achievements.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{
        textAlign: 'center' as const,
        marginBottom: '32px',
      }}>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || 'https://wellnourish.ai'}
          style={{
            display: 'inline-block',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
          }}
        >
          Get Started
        </a>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '24px',
        textAlign: 'center' as const,
      }}>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          margin: '0',
        }}>
          © {new Date().getFullYear()} WellNourish AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default WelcomeEmail;
