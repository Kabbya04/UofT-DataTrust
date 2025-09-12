import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { label: string, href?: string }[] }) {
  return (
    <nav className="text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:underline">{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="mx-1">{'>'}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}