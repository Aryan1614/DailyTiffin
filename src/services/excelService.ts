import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import dayjs from 'dayjs';
import { OrderHistoryItem } from '../types';

export const exportToExcel = async (orders: OrderHistoryItem[], monthLabel: string): Promise<void> => {
  // Sort orders by date
  const sortedOrders = [...orders].sort((a, b) => a.date.localeCompare(b.date));

  // Calculate stats
  const vegCount = sortedOrders.filter(o => o.status !== 'skipped' && o.mealType === 'veg').length;
  const nonvegCount = sortedOrders.filter(o => o.status !== 'skipped' && o.mealType === 'nonveg').length;
  const skippedCount = sortedOrders.filter(o => o.status === 'skipped').length;
  const totalOrdered = vegCount + nonvegCount;

  // Title rows
  const sheetData: any[][] = [
    ['Daily Tiffin - Monthly Report'],
    [`Month: ${monthLabel}`],
    [`Generated: ${dayjs().format('DD MMM YYYY, hh:mm A')}`],
    [],
    ['SUMMARY'],
    ['Veg Meals', vegCount],
    ['Non-Veg Meals', nonvegCount],
    ['Total Ordered', totalOrdered],
    ['Skipped Days', skippedCount],
    [],
    ['ORDER DETAILS'],
    ['Sr No', 'Date', 'Day', 'Meal Type', 'Status', 'Location'],
  ];

  // Data rows
  sortedOrders.forEach((o, index) => {
    sheetData.push([
      index + 1,
      dayjs(o.date).format('DD MMM YYYY'),
      dayjs(o.date).format('dddd'),
      o.status === 'skipped' ? '-' : o.mealType === 'veg' ? 'Veg' : 'Non-Veg',
      o.status === 'ordered' ? 'Ordered' : o.status === 'changed' ? 'Changed' : 'Skipped',
      o.status === 'skipped' ? '-' : o.location,
    ]);
  });

  // Footer
  sheetData.push([]);
  sheetData.push(['--- End of Report ---']);

  // Create worksheet from array
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },   // Sr No
    { wch: 14 },  // Date
    { wch: 12 },  // Day
    { wch: 12 },  // Meal Type
    { wch: 10 },  // Status
    { wch: 12 },  // Location
  ];

  // Merge title row across all columns
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },  // Title
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },  // Month
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },  // Generated date
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tiffin Report');

  // Write to file
  const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const fileName = `Tiffin_Report_${monthLabel.replace(' ', '_')}.xlsx`;
  const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  await RNFS.writeFile(filePath, wbout, 'base64');

  // Share
  await Share.open({
    url: `file://${filePath}`,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filename: fileName,
    title: `Tiffin Report - ${monthLabel}`,
  });
};