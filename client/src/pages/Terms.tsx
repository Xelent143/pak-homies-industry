import PageHeader from "@/components/PageHeader";

export default function Terms() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of service" />
      <article className="container-page py-20 max-w-3xl text-[#1A1A1A]/85 space-y-6">
        <p>
          By using pakhomiesind.com or engaging Pak Homies Industry for manufacturing services you agree to the
          following terms.
        </p>
        <h2 className="font-display text-2xl">Quotes & MOQ</h2>
        <p>All quotes are valid for 30 days from issue. Minimum order quantity is 50 pieces per garment style.</p>
        <h2 className="font-display text-2xl">Payment</h2>
        <p>30% deposit on bulk order, 70% before shipping. Payment via wire transfer or PayPal. All amounts in USD.</p>
        <h2 className="font-display text-2xl">Production & QA</h2>
        <p>We produce to the approved sample. ±1% tolerance on measurements. 0% defect SLA — any defective unit
          will be replaced or refunded.</p>
        <h2 className="font-display text-2xl">Shipping</h2>
        <p>Quoted prices include freight to USA port. Duties and last-mile delivery are buyer's responsibility.</p>
        <h2 className="font-display text-2xl">IP & confidentiality</h2>
        <p>You retain full ownership of your designs. We do not produce competing designs and do not share your
          files. Confidentiality agreement signed on every bulk order.</p>
        <h2 className="font-display text-2xl">Liability</h2>
        <p>Liability is limited to the value of the order. We are not responsible for downstream losses from
          freight delays beyond our control.</p>
      </article>
    </>
  );
}
