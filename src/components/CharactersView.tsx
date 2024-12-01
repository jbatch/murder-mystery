// components/CharactersView
import { Character } from "@/types";
import { Card, CardContent } from "./ui/card";

const CharactersView = ({ characters }: { characters?: Character[] }) => (
  <div className="grid gap-4 mt-4">
    {characters?.map((char, i) => (
      <Card key={i}>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg mb-2">{char.name}</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Occupation:</span> {char.occupation}
            </p>
            <p>
              <span className="font-medium">Connection:</span>{" "}
              {char.connection_to_victim}
            </p>
            <p>
              <span className="font-medium">Motive:</span>{" "}
              {char.potential_motive}
            </p>
            <p>
              <span className="font-medium">Secret:</span> {char.secret}
            </p>
            <p>
              <span className="font-medium">Alibi:</span> {char.alibi}
            </p>
          </div>
        </CardContent>
      </Card>
    ))}
    {!characters && (
      <p className="text-gray-500">Generate a mystery to see the characters</p>
    )}
  </div>
);

export default CharactersView;
