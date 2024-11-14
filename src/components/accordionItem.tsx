import Icon from "@utils/Icons";

interface AccordionItemProps {
  children: React.ReactNode;
  title: string;
  block?: boolean;
  index: number;
}

export default function AccordionItem({
  children,
  title,
  block = false,
  index,
}: AccordionItemProps) {
  return (
    <div
      className={`hs-accordion py-2 ${index == 1 && "active"}`}
      id="hs-basic-with-title-and-arrow-stretched-heading-one"
    >
      <button
        className={`hs-accordion-toggle group py-3 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-left text-gray-800 transition ${
          block && "shadow-md bg-gray-50 px-5 py-5 rounded-lg"
        }`}
        aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
      >
        {title}
        <Icon
          name="chevron-down"
          className="hs-accordion-active:hidden block"
          color="#1F2937"
        />
        <Icon
          name="chevron-up"
          className="hs-accordion-active:block hidden"
          color="#1F2937"
        />
      </button>
      <div
        id="hs-basic-with-title-and-arrow-stretched-collapse-one"
        className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
        aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
      >
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
