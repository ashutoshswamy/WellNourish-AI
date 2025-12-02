import * as React from 'react';

interface WelcomeEmailProps {
  email?: string;
  userName?: string;
  siteUrl?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ 
  email,
  userName = 'there',
  siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wellnourishai.in'
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to WellNourish AI!</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f7f7f7', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {/* Outer Table (Background and Centering) */}
        <table border={0} cellPadding={0} cellSpacing={0} width="100%" style={{ tableLayout: 'fixed', backgroundColor: '#f7f7f7' }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '40px 0' }}>
                {/* Inner Table (Email Content Container) */}
                <table border={0} cellPadding={0} cellSpacing={0} width="100%" style={{ maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
                  <tbody>
                    {/* Header (Logo/Company Name) */}
                    <tr>
                      <td align="center" style={{ padding: '30px 20px 20px 20px' }}>
                        <a href="https://wellnourishai.in" target="_blank" style={{ textDecoration: 'none' }}>
                          <span style={{ fontSize: '20px', color: '#34495e', fontWeight: 'bold' }}>WellNourish AI</span>
                        </a>
                      </td>
                    </tr>

                    {/* Main Content */}
                    <tr>
                      <td style={{ padding: '0 40px 20px 40px', color: '#34495e', fontSize: '16px', lineHeight: 1.6 }}>
                        <h1 style={{ color: '#34495e', fontSize: '28px', marginTop: 0, marginBottom: '25px', textAlign: 'center', fontWeight: 300 }}>
                          Your AI-Powered Wellness Journey Begins Here.
                        </h1>

                        <p style={{ marginBottom: '15px' }}>Hi {userName},</p>
                        
                        <p style={{ marginBottom: '25px' }}>A huge welcome to the WellNourish AI family! We are delighted to partner with you as you take this step toward personalized health and nutrition.</p>
                        
                        <p style={{ marginBottom: '25px' }}>You are moments away from unlocking your custom meal plans and workout routines—all crafted by advanced AI tailored precisely to your goals, preferences, and dietary needs.</p>
                      </td>
                    </tr>

                    {/* CTA Section */}
                    <tr>
                      <td align="center" style={{ padding: '10px 40px 40px 40px' }}>
                        <p style={{ color: '#555555', fontSize: '16px', marginBottom: '20px' }}>
                          Ready to transform your health? Complete your profile to get started:
                        </p>

                        {/* CTA Button Table */}
                        <table border={0} cellSpacing={0} cellPadding={0} style={{ margin: 'auto' }}>
                          <tbody>
                            <tr>
                              <td align="center" style={{ borderRadius: '4px', backgroundColor: '#2ecc71' }}>
                                <a href={`${siteUrl}/dashboard`} target="_blank" style={{ fontSize: '17px', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#ffffff', textDecoration: 'none', borderRadius: '4px', padding: '12px 25px', border: '1px solid #2ecc71', display: 'inline-block', fontWeight: 'bold' }}>
                                   ACCESS YOUR PERSONALIZED PLAN
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Feature Section */}
                    <tr>
                      <td style={{ padding: '0 40px 30px 40px' }}>
                        <h2 style={{ color: '#34495e', fontSize: '20px', marginTop: 0, marginBottom: '15px', fontWeight: 500 }}>
                          What You Can Expect:
                        </h2>
                        
                        {/* Features List */}
                        <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: '10px' }}>
                                <p style={{ margin: 0, fontSize: '16px', color: '#34495e' }}>
                                  ✅ <strong>Custom Meal Plans:</strong> Detailed recipes, nutritional data, and grocery lists.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingBottom: '10px' }}>
                                <p style={{ margin: 0, fontSize: '16px', color: '#34495e' }}>
                                  ✅ <strong>Workout Routines:</strong> Exercise plans designed to complement your nutritional goals.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingBottom: '10px' }}>
                                <p style={{ margin: 0, fontSize: '16px', color: '#34495e' }}>
                                  ✅ <strong>Allergy Safe:</strong> Guaranteed adherence to all your dietary restrictions.
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Closing */}
                    <tr>
                      <td style={{ padding: '0 40px 40px 40px', color: '#34495e', fontSize: '16px', lineHeight: 1.6 }}>
                        <p style={{ marginTop: '25px' }}>We look forward to helping you achieve your wellness goals!</p>
                        <p style={{ marginBottom: 0 }}>Sincerely,</p>
                        <p style={{ fontWeight: 'bold', color: '#34495e', marginTop: '5px' }}>The WellNourish AI Team</p>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td align="center" style={{ padding: '20px 40px', backgroundColor: '#f9f9f9', color: '#999999', fontSize: '12px', borderTop: '1px solid #e0e0e0' }}>
                        <p style={{ margin: '0 0 10px 0' }}>
                          <a href="https://wellnourishai.in/terms" style={{ color: '#777777', textDecoration: 'none' }}>Terms of Service</a> &nbsp;|&nbsp; 
                          <a href="https://wellnourishai.in/privacy" style={{ color: '#777777', textDecoration: 'none' }}>Privacy Policy</a>
                        </p>
                        <p style={{ marginTop: '10px', marginBottom: 0 }}>© 2025 WellNourish AI. All rights reserved.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* End Inner Table */}
              </td>
            </tr>
          </tbody>
        </table>
        {/* End Outer Table */}
      </body>
    </html>
  );
};

export default WelcomeEmail;
