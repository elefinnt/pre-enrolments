# Pre-Enrollment Helper Application

A modern, user-friendly web application designed to streamline the pre-enrollment process for schools. Built with Next.js, TypeScript, and Shadcn UI components.

## Features

- **Multi-step Form Process**: A guided, step-by-step enrollment form that breaks down the process into manageable sections
- **Dynamic Parent/Guardian Management**: Add or remove multiple parents/guardians
- **Smart Date Calculations**:
  - Automatic age calculation
  - Enrollment year determination
  - Term date calculations
  - Next available intake dates
- **Clipboard Integration**: Copy all enrollment details with a single click
- **Responsive Design**: Works seamlessly on all device sizes
- **Modern UI**: Built with Shadcn UI components for a polished look and feel

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Form Validation**: Built-in HTML5 validation
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd pre-enrollment
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Form Structure

The pre-enrollment form is divided into four main steps:

1. **Child Information**

   - Full Name
   - Gender
   - Date of Birth
   - Automatic enrollment calculations

2. **Parent/Guardian Information**

   - Multiple parent/guardian support
   - Relationship selection
   - Contact details (name, phone, email)

3. **Address Information**

   - Complete home address details

4. **Summary**
   - Complete enrollment summary
   - Copy to clipboard functionality
   - Next steps information

## Validation Rules

- **Names**: Text only, minimum 2 characters
- **Phone Numbers**: Numbers only
- **Email**: Valid email format
- **Address**: Minimum 5 characters
- **Required Fields**: All fields are mandatory

## Development

### Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   └── pre-enrolment-form.tsx
├── styles/             # Global styles
└── lib/                # Utility functions
```

### Adding New Features

1. Create new components in the `components` directory
2. Add new utility functions in the `lib` directory
3. Update the form validation as needed
4. Test thoroughly before committing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [date-fns](https://date-fns.org/)
- [Sonner](https://sonner.emilkowal.ski/)

## Please Note

No user data is stored in this app. This app holds no child, parent, address, phone number OR email address.
