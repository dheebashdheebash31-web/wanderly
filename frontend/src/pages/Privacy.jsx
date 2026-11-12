import LegalPage from "../components/LegalPage";
import "../styles/legal_style.css";

const SECTIONS = [
  {
    icon: "fa-circle-info",
    heading: "Introduction",
    paragraph:
      "At Wanderly Travel, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information whenever you use our website and services.",
  },
  {
    icon: "fa-database",
    heading: "Information We Collect",
    list: ["Full Name", "Email Address", "Phone Number", "Travel Preferences", "Booking Details"],
  },
  {
    icon: "fa-user-check",
    heading: "How We Use Your Information",
    list: [
      "Process travel bookings",
      "Provide customer support",
      "Send booking confirmations and travel updates",
      "Improve our website and travel services",
      "Share promotional offers (only with your permission)",
    ],
  },
  {
    icon: "fa-lock",
    heading: "Data Security",
    paragraph:
      "We use industry-standard security measures to protect your personal information against unauthorized access, misuse, or disclosure.",
  },
  {
    icon: "fa-cookie-bite",
    heading: "Cookies",
    paragraph:
      "Our website uses cookies to improve user experience, remember your preferences, and analyze website traffic. You can disable cookies through your browser settings at any time.",
  },
  {
    icon: "fa-share-nodes",
    heading: "Third-Party Services",
    paragraph:
      "We may use trusted third-party providers for secure payment processing, email communication, and analytics. These providers have their own privacy policies.",
  },
  {
    icon: "fa-envelope",
    heading: "Contact Us",
    paragraph: "If you have any questions regarding this Privacy Policy, please contact our support team.",
  },
];

export default function Privacy() {
  return (
    <LegalPage
      icon="fa-shield-halved"
      title="Privacy Policy"
      lead="Your privacy and data security are important to us."
      sections={SECTIONS}
    />
  );
}
