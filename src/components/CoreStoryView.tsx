// components/CoreSToryView.tsx
import { CoreStory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CoreStoryView = ({ story }: { story?: CoreStory }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Core Story</CardTitle>
    </CardHeader>
    <CardContent>
      {story ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Setting</h3>
            <p>
              {story.setting.location} - {story.setting.time_period}
            </p>
            <p>Time: {story.setting.specific_time}</p>
          </div>
          <div>
            <h3 className="font-semibold">Victim</h3>
            <p>
              {story.victim.name} - {story.victim.occupation}
            </p>
            <p>Targeted because: {story.victim.reason_targeted}</p>
          </div>
          <div>
            <h3 className="font-semibold">Murderer</h3>
            <p>Name: {story.murderer.name}</p>
            <p>Occupation: {story.murderer.occupation}</p>
            <p>Motive: {story.murderer.motive}</p>
          </div>
          <div>
            <h3 className="font-semibold">Murder Method</h3>
            <p>Weapon: {story.murder_method.weapon}</p>
            <p>Circumstances: {story.murder_method.circumstances}</p>
          </div>
          <div>
            <h3 className="font-semibold">Key Twist</h3>
            <p>{story.key_twist}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          Generate a mystery to see the core story
        </p>
      )}
    </CardContent>
  </Card>
);

export default CoreStoryView;
