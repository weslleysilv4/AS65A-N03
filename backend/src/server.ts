import app from './app';
import { scheduleMaintenanceJob } from './shared/jobs/maintenance.job';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  scheduleMaintenanceJob();
});
