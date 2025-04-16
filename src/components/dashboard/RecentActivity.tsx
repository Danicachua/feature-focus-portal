
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: number;
  action: string;
  time: string;
  user: string;
}

const activities: Activity[] = [
  { id: 1, action: "Added new product: Wireless Earbuds", time: "2 hours ago", user: "John Doe" },
  { id: 2, action: "Updated inventory count", time: "4 hours ago", user: "Sarah Smith" },
  { id: 3, action: "Modified product description", time: "Yesterday", user: "Mike Johnson" },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-semibold">
                {activity.user[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{activity.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
