import LegalPage from "../components/LegalPage";
import "../styles/legal_style.css";

const SECTIONS = [
  {
    icon: "fa-circle-info",
    heading: "Acceptance of Terms",
    paragraph:
      "By accessing or using the Wanderly Travel website, you agree to comply with these Terms & Conditions. If you do not agree with any part of these terms, please discontinue using our services.",
  },
  {
    icon: "fa-credit-card",
    heading: "Booking Policy",
    paragraph:
      "All bookings are confirmed only after successful payment verification. Prices and availability are subject to change until confirmation.",
  },
  {
    icon: "fa-ban",
    heading: "Cancellation Policy",
    paragraph:
      "Cancellation charges may apply depending on the selected travel package and cancellation period. Refunds will be processed according to the applicable cancellation policy.",
  },
  {
    icon: "fa-user-check",
    heading: "User Responsibilities",
    list: [
      "Provide accurate personal and payment information.",
      "Carry valid passports, visas, and travel documents.",
      "Follow local laws and regulations while travelling.",
      "Respect hotel, airline, and tour operator policies.",
    ],
  },
  {
    icon: "fa-triangle-exclamation",
    heading: "Limitation of Liability",
    paragraph:
      "Wanderly Travel is not responsible for delays, cancellations, schedule changes, weather conditions, natural disasters, or losses caused by airlines, hotels, or other third-party service providers.",
  },
  {
    icon: "fa-rotate",
    heading: "Changes to Terms",
    paragraph:
      "We reserve the right to modify or update these Terms & Conditions at any time without prior notice. Continued use of our services constitutes acceptance of the revised terms.",
  },
  {
    icon: "fa-envelope",
    heading: "Need Assistance?",
    paragraph: "If you have any questions regarding these Terms & Conditions, please feel free to contact our support team.",
  },
];

export default function Terms() {
  return (
    <LegalPage
      icon="fa-file-contract"
      title="Terms & Conditions"
      lead="Please read these terms carefully before using Wanderly Travel services."
      sections={SECTIONS}
    />
  );
}
