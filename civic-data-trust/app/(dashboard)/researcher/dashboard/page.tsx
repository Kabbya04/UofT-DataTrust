import PlaceholderPage from "@/app/components/PlaceholderPage";

export default function ResearcherDashboard() {
  return (
    <PlaceholderPage
      title="Researcher Dashboard"
      description="This is the main dashboard for the 'Researcher' role. Content specific to researchers will be displayed here."
    >
      <p className="text-muted-foreground">
        Future components for researchers might include:
      </p>
      <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
        <li>Advanced statistical analysis tools.</li>
        <li>Access to raw, de-identified datasets.</li>
        <li>Collaboration spaces for research projects.</li>
        <li>Data publication and citation tools.</li>
      </ul>
    </PlaceholderPage>
  );
}