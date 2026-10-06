interface Props {
  title: string;
  value: string | number;
}

export default function StatsCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}