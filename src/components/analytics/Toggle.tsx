import Button from "../Button.tsx";

type ToggleProps = {
  choices: [string, string];
  firstIsOn: boolean;
  onChange: (firstIsOn: boolean) => void;
};

// Two buttons side by side where exactly one is picked, like "Percent | Students".
export function Toggle({ choices, firstIsOn, onChange }: ToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-zinc-800 p-1 text-sm">
      <Button variant={firstIsOn ? "primary" : "secondary"} onClick={() => onChange(true)}>
        {choices[0]}
      </Button>
      <Button variant={firstIsOn ? "secondary" : "primary"} onClick={() => onChange(false)}>
        {choices[1]}
      </Button>
    </div>
  );
}
