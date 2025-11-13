import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateMachineReport = (machine, readings, maintenance) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233);
  doc.text('Smart Factory Maintenance Report', 14, 20);
  
  // Machine Details
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Machine Details', 14, 35);
  
  doc.setFontSize(11);
  doc.text(`Name: ${machine.name}`, 14, 45);
  doc.text(`Model: ${machine.model}`, 14, 52);
  doc.text(`Department: ${machine.department}`, 14, 59);
  doc.text(`Status: ${machine.status}`, 14, 66);
  doc.text(`Total Runtime: ${machine.total_hours_run.toFixed(1)} hours`, 14, 73);
  doc.text(`Last Maintenance: ${machine.last_maintenance_date || 'Never'}`, 14, 80);
  
  // Recent Readings Table
  doc.setFontSize(16);
  doc.text('Recent Readings', 14, 95);
  
  const readingsData = readings.slice(0, 10).map(r => [
    new Date(r.reading_date).toLocaleDateString(),
    r.temperature.toFixed(1),
    r.vibration.toFixed(2),
    r.pressure?.toFixed(1) || 'N/A',
    r.operator_name,
    r.is_abnormal ? 'Yes' : 'No'
  ]);
  
  doc.autoTable({
    head: [['Date', 'Temp (°C)', 'Vibration', 'Pressure', 'Operator', 'Abnormal']],
    body: readingsData,
    startY: 100,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
  });
  
  // Maintenance History
  const finalY = doc.lastAutoTable.finalY || 100;
  doc.setFontSize(16);
  doc.text('Maintenance History', 14, finalY + 15);
  
  const maintenanceData = maintenance.map(m => [
    m.maintenance_date,
    m.maintenance_type,
    m.performed_by,
    m.status,
    m.notes || ''
  ]);
  
  doc.autoTable({
    head: [['Date', 'Type', 'Performed By', 'Status', 'Notes']],
    body: maintenanceData,
    startY: finalY + 20,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Save
  doc.save(`${machine.name}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateAllMachinesReport = (machines, stats) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233);
  doc.text('Factory Maintenance Summary Report', 14, 20);
  
  // Summary Statistics
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary Statistics', 14, 35);
  
  doc.setFontSize(11);
  doc.text(`Total Machines: ${stats.total}`, 14, 45);
  doc.text(`Machines Due Soon: ${stats.dueSoon}`, 14, 52);
  doc.text(`Overdue Machines: ${stats.overdue}`, 14, 59);
  doc.text(`At Risk Machines: ${stats.atRisk}`, 14, 66);
  
  // Machines Table
  doc.setFontSize(14);
  doc.text('All Machines Status', 14, 80);
  
  const machinesData = machines.map(m => [
    m.name,
    m.model,
    m.department,
    m.status,
    m.total_hours_run.toFixed(1),
    m.last_maintenance_date || 'Never'
  ]);
  
  doc.autoTable({
    head: [['Name', 'Model', 'Department', 'Status', 'Runtime (hrs)', 'Last Maintenance']],
    body: machinesData,
    startY: 85,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9 },
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }
  
  doc.save(`Factory_Summary_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};