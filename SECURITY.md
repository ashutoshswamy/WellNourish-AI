# Security Policy

## Supported Versions

The following versions of the WellNourish AI project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of our application seriously. If you have discovered a security vulnerability, please follow these steps to report it to us.

1.  **Do not disclose the vulnerability publicly.** This gives us time to fix the issue before it can be exploited.
2.  **Email us** at ashutoshswamy397@gmail.com (replace with actual email if available) with a detailed description of the vulnerability.
3.  **Include steps to reproduce** the issue, if possible.

We will acknowledge your report within 48 hours and work to resolve the issue as quickly as possible.

## Security Best Practices

We strive to follow security best practices in our development:
- **Authentication**: We use secure, industry-standard authentication via Supabase (OAuth/JWT).
- **Data Protection**: User data is protected using Row Level Security (RLS) policies in PostgreSQL.
- **Environment Variables**: Sensitive keys (like API secrets) are stored in environment variables and never committed to the repository.
- **Input Validation**: We use Zod for schema validation to ensure data integrity and prevent injection attacks.

## License

This project is licensed under the MIT License.
