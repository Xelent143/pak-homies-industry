import PageHeader from "@/components/PageHeader";

export default function Privacy() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" />
      <article className="container-page py-20 max-w-3xl prose-base text-[#1A1A1A]/85 space-y-6">
        <p>
          Pak Homies Industry ("we", "us") collects only the information you choose to share with us through our
          inquiry form, email, or WhatsApp. This includes your name, brand, contact details, and any tech-pack
          documents or images you upload.
        </p>
        <h2 className="font-display text-2xl">What we collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contact information (name, email, WhatsApp, city)</li>
          <li>Inquiry content (products, quantities, customizations, files you upload)</li>
          <li>Server logs for fraud prevention (IP, user-agent, timestamps)</li>
        </ul>
        <h2 className="font-display text-2xl">How we use it</h2>
        <p>We use your information solely to respond to your inquiry, generate quotes, and produce your order. We
          never sell, share, or use your design files for any other client.</p>
        <h2 className="font-display text-2xl">Confidentiality</h2>
        <p>Every order is covered by a confidentiality agreement. We do not produce competing designs, we do not
          show your designs to other buyers, and we do not retain files beyond the production cycle unless you
          ask us to.</p>
        <h2 className="font-display text-2xl">Your rights</h2>
        <p>You may request a copy of your data, ask us to delete it, or withdraw consent at any time by emailing
          Pakhomiesi@gmail.com.</p>
      </article>
    </>
  );
}
