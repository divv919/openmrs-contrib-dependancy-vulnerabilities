import "./App.css";
import { Header } from "./components/Header";
import { ReportCard } from "./components/ReportCard";
import { normalizedReports } from "./util/getAllReports";

function App() {
  return (
    <div
      style={{
        padding: "36px",
      }}
    >
      <Header />
      <div className="dashboard">
        {normalizedReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

export default App;
