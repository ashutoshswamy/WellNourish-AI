import * as React from 'react';

interface WelcomeEmailProps {
  email?: string;
  siteUrl?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ 
  email,
  siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wellnourish.ai'
}) => {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f6f8f5', fontFamily: 'Arial, sans-serif' }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ padding: '36px 12px', background: '#f6f8f5' }}>
          <tbody>
            <tr>
              <td align="center">
                <table width={600} style={{ maxWidth: '600px', background: '#ffffff', borderRadius: '8px', padding: '28px 36px', border: '1px solid #e6efe6' }}>
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td align="center" style={{ color: '#2f8f3e', fontSize: '22px', fontWeight: 700 }}>
                        WellNourish AI
                      </td>
                    </tr>

                    {/* Welcome Banner */}
                    <tr>
                      <td style={{ background: '#eef8ef', padding: '16px 18px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, color: '#1e3a26', marginTop: '12px' }}>
                        Welcome to WellNourish AI
                      </td>
                    </tr>

                    {/* Spacer */}
                    <tr>
                      <td style={{ height: '14px' }}></td>
                    </tr>

                    {/* Welcome Message */}
                    <tr>
                      <td style={{ fontSize: '15px', color: '#2b2b2b', lineHeight: 1.6 }}>
                        Welcome — your account is ready. Use the link below to go to the site and start creating your personalized meal &amp; workout plans.
                      </td>
                    </tr>

                    {/* Spacer */}
                    <tr>
                      <td style={{ height: '18px' }}></td>
                    </tr>

                    {/* CTA Button */}
                    <tr>
                      <td align="center">
                        <a
                          href={siteUrl}
                          style={{
                            background: '#2f8f3e',
                            color: '#ffffff',
                            padding: '12px 26px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            display: 'inline-block',
                          }}
                        >
                          Get Started
                        </a>
                      </td>
                    </tr>

                    {/* Spacer */}
                    <tr>
                      <td style={{ height: '18px' }}></td>
                    </tr>

                    {/* Account Email */}
                    <tr>
                      <td style={{ fontSize: '13px', color: '#6c7a6c', lineHeight: 1.5 }}>
                        Account email: <strong>{email}</strong>
                      </td>
                    </tr>

                    {/* Divider */}
                    <tr>
                      <td style={{ paddingTop: '22px' }}>
                        <hr style={{ border: 'none', borderTop: '1px solid #e6efe6' }} />
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td align="center" style={{ fontSize: '12px', color: '#9aa59a' }}>
                        © 2025 WellNourish AI — Pune, Maharashtra
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};

export default WelcomeEmail;
