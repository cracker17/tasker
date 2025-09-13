import jsPDF from 'jspdf';

export interface TaskReportData {
  title: string;
  description?: string;
  priority?: string;
  completedAt: Date;
  totalTime: number;
  tags?: string[];
}

export function generateDailyTaskReport(tasks: TaskReportData[], customTitle?: string): void {
  const doc = new jsPDF();

  // Set up document
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Invoice-style header
  doc.setFillColor(41, 128, 185); // Blue header
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company/Logo area
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TASKER', margin, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Task Management Solutions', margin, 32);

  // Invoice details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TASK REPORT', pageWidth - margin, 25, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${customTitle || 'Daily Report'}`, pageWidth - margin, 32, { align: 'right' });

  yPosition = 55;

  // Bill To section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Summary', margin, yPosition);
  yPosition += 8;

  // Summary box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 25);

  const totalTasks = tasks.length;
  const totalTime = tasks.reduce((sum, task) => sum + task.totalTime, 0);
  const totalHours = Math.round(totalTime / 1000 / 60 / 60 * 100) / 100; // Round to 2 decimal places

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Tasks Completed: ${totalTasks}`, margin + 5, yPosition + 8);
  doc.text(`Total Hours Worked: ${totalHours}h`, margin + 5, yPosition + 15);
  doc.text(`Average per Task: ${totalTasks > 0 ? (totalHours / totalTasks).toFixed(2) : 0}h`, margin + 5, yPosition + 22);

  yPosition += 35;

  // Task details table
  if (tasks.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Task Details', margin, yPosition);
    yPosition += 10;

    // Table headers
    const tableStartY = yPosition;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');

    doc.text('Task', margin + 2, yPosition);
    doc.text('Priority', margin + 80, yPosition);
    doc.text('Time', margin + 110, yPosition);
    doc.text('Completed', margin + 140, yPosition);

    yPosition += 12;

    // Table rows
    doc.setFont('helvetica', 'normal');
    tasks.forEach((task, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;

        // Repeat header on new page
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('TASKER', margin, 25);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Task Management Solutions', margin, 32);
        doc.setTextColor(0, 0, 0);
        yPosition = 55;
      }

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, 10, 'F');
      }

      // Task title (truncated if too long)
      const title = task.title.length > 20 ? task.title.substring(0, 17) + '...' : task.title;
      doc.text(title, margin + 2, yPosition);

      // Priority
      const priority = task.priority || 'Normal';
      doc.text(priority, margin + 80, yPosition);

      // Time
      const time = formatTime(task.totalTime);
      doc.text(time, margin + 110, yPosition);

      // Completion time
      const completedTime = task.completedAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(completedTime, margin + 140, yPosition);

      yPosition += 8;

      // Add description if available (compact)
      if (task.description && task.description.trim()) {
        const description = stripHtml(task.description).substring(0, 60);
        if (description.trim()) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(description + (task.description.length > 60 ? '...' : ''), margin + 2, yPosition);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(9);
          yPosition += 6;
        }
      }
    });

    // Total summary at bottom
    yPosition += 10;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL HOURS WORKED:', margin + 100, yPosition);
    doc.text(`${totalHours}h`, margin + 160, yPosition);
  } else {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('No tasks were completed today.', margin, yPosition);
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Generated by Tasker - Professional Task Management Application', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Report generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 5, { align: 'center' });

  // Save the PDF
  const fileName = `tasker-productivity-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
}

function stripHtml(html: string): string {
  // Simple HTML tag removal for PDF text
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&/g, '&');
}