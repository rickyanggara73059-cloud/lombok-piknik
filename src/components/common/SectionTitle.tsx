import ScrollReveal from "./ScrollReveal";

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  center = true,
}: SectionTitleProps) {
  return (
    <ScrollReveal>

      <div className={`${center ? "text-center" : "text-left"} mb-14`}>

        {subtitle && (
          <p className="mb-3 text-sm font-bold uppercase tracking-[4px] text-yellow-500">
            {subtitle}
          </p>
        )}


        <h2 className="text-4xl font-black text-gray-900 md:text-5xl">
          {title}
        </h2>


        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            {description}
          </p>
        )}

      </div>

    </ScrollReveal>
  );
}