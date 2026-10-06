export default function Activities() {
    const activities = [
      {
        title: "New member registered",
        date: "Today",
      },
      {
        title: "Tithe payment received",
        date: "Yesterday",
      },
      {
        title: "Sunday service completed",
        date: "2 days ago",
      },
    ];
  
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Recent Activities
        </h2>
  
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-3"
            >
              <span>{activity.title}</span>
              <span className="text-gray-500 text-sm">
                {activity.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }