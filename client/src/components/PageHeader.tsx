interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="bg-[#1A1A1A] text-white">
      <div className="container-page py-20 md:py-28">
        {eyebrow && (
          <div className="ribbon-text text-[#5A5DCB] mb-4">{eyebrow}</div>
        )}
        <h1 className="font-display text-4xl md:text-6xl text-white max-w-4xl leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-white/70 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
