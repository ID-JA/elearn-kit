import { Button, Title } from "@mantine/core";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4 flex-col">
      <Title className="mb-10">E-Learning Wizard</Title>
      <Button>Getting Started</Button>
    </main>
  );
}