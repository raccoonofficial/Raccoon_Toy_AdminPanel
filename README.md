# Raccoon Toy Admin Panel

A React-based admin panel with sales data visualization.

## Features

- **SalesChart Component**: A responsive bar chart component for displaying sales data
- **Sample Data Support**: Built-in sample data for testing and demonstration
- **Dynamic Data**: Supports custom data input
- **Proper Scaling**: Automatic Y-axis scaling with proper tick marks (0, 5k, 10k, 15k, ...)
- **Responsive Design**: Clean, modern UI with proper formatting

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will be available at `http://localhost:5173/`

## Building for Production

```bash
npm run build
```

## SalesChart Component Usage

### Props

- `data` (array, optional): Array of sales data objects. Each object should have:
  - `month` (string): Label for the data point (e.g., "Jan", "Q1")
  - `sales` (number): Sales value
- `forceSample` (boolean, default: false): When true, forces the display of sample data

### Example Usage

```jsx
import SalesChart from './components/SalesChart';

// Using sample data
<SalesChart forceSample={true} />

// Using custom data
const customData = [
  { month: 'Q1', sales: 30000 },
  { month: 'Q2', sales: 35000 },
  { month: 'Q3', sales: 28000 },
  { month: 'Q4', sales: 42000 },
];

<SalesChart data={customData} />
```

### Features

1. **Fallback Logic**: Automatically uses sample data when:
   - `forceSample` prop is `true`
   - No data is provided
   - Data array is empty

2. **Automatic Scaling**: 
   - Y-axis automatically scales based on the maximum value
   - Rounds up to the nearest 5000 for clean tick marks
   - Displays values in "k" format (e.g., 5k, 10k, 15k)

3. **Visual Feedback**:
   - Hover tooltips showing exact values
   - Value labels on top of each bar
   - Clear axis labels and formatting
   - Indicator when showing sample data