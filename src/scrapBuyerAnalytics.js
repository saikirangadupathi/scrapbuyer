import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import { HeatMapGrid } from 'react-grid-heatmap';
import 'react-circular-progressbar/dist/styles.css';

// Register components and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const styles = {
  pageContainer: {
    padding: '40px',
    backgroundColor: '#f0f4f8',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  inputSection: {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  inputHeader: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px',
  },
  inputField: {
    flex: '1 1 30%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #bdc3c7',
    fontSize: '16px',
    color: '#34495e',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#3498db',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    alignSelf: 'flex-start',
  },
  submitButtonHover: {
    backgroundColor: '#2980b9',
  },
  container: {
    padding: '20px',
    backgroundColor: '#f4f7fc',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px',
    margin: 'auto',
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#34495e',
    textAlign: 'center',
    marginBottom: '20px',
  },
  chartContainer: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  kpiCard: {
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  kpiCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  kpiContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  backButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  backButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#3498db',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  backButtonHover: {
    backgroundColor: '#2980b9',
  },
};

const AnalyticsAndReports = ({ t }) => {
  const [selectedKPI, setSelectedKPI] = useState(null);

  // State to manage input data for each KPI
  const [inventoryTurnoverData, setInventoryTurnoverData] = useState({ currentRatio: 7.0, previousRatio: 6.5 });
  const [materialAcquisitionData, setMaterialAcquisitionData] = useState([500, 1000, 750]);
  const [revenueData, setRevenueData] = useState([300, 500, 200]);
  const [profitMarginData, setProfitMarginData] = useState([15, 20, 25, 30]);
  const [inventoryAgingData, setInventoryAgingData] = useState([[30, 20, 10], [15, 10, 5], [5, 10, 15]]);
  const [supplierPerformanceData, setSupplierPerformanceData] = useState({
    labels: ['Cost', 'Quality', 'Reliability'],
    dataA: [80, 90, 85],
    dataB: [70, 85, 75],
  });
  const [materialQualityData, setMaterialQualityData] = useState([4.5, 4.0, 3.5]);
  const [orderFulfillmentRate, setOrderFulfillmentRate] = useState(95);
  const [environmentalImpactData, setEnvironmentalImpactData] = useState([80, 60, 75]);
  const [operationalEfficiencyData, setOperationalEfficiencyData] = useState([85, 88, 90, 92]);

  const handleKPIClick = (kpi) => {
    setSelectedKPI(kpi);
  };

  const renderKPICard = () => {
    switch (selectedKPI) {
      case t('Inventory Turnover Ratio'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Inventory Turnover Ratio Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Current Ratio')}:
                <input
                  type="number"
                  value={inventoryTurnoverData.currentRatio}
                  onChange={(e) =>
                    setInventoryTurnoverData({ ...inventoryTurnoverData, currentRatio: parseFloat(e.target.value) })
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Previous Ratio')}:
                <input
                  type="number"
                  value={inventoryTurnoverData.previousRatio}
                  onChange={(e) =>
                    setInventoryTurnoverData({ ...inventoryTurnoverData, previousRatio: parseFloat(e.target.value) })
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <CircularProgressbar
                value={(inventoryTurnoverData.currentRatio / inventoryTurnoverData.previousRatio) * 100}
                text={`${inventoryTurnoverData.currentRatio}`}
              />
            </div>
          </div>
        );
      case t('Material Acquisition Cost'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Material Acquisition Cost Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('January')}:
                <input
                  type="number"
                  value={materialAcquisitionData[0]}
                  onChange={(e) =>
                    setMaterialAcquisitionData([parseFloat(e.target.value), materialAcquisitionData[1], materialAcquisitionData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('February')}:
                <input
                  type="number"
                  value={materialAcquisitionData[1]}
                  onChange={(e) =>
                    setMaterialAcquisitionData([materialAcquisitionData[0], parseFloat(e.target.value), materialAcquisitionData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('March')}:
                <input
                  type="number"
                  value={materialAcquisitionData[2]}
                  onChange={(e) =>
                    setMaterialAcquisitionData([materialAcquisitionData[0], materialAcquisitionData[1], parseFloat(e.target.value)])
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <Bar
                data={{
                  labels: [t('Jan'), t('Feb'), t('Mar')],
                  datasets: [{ label: t('Cost'), data: materialAcquisitionData, backgroundColor: 'rgba(75,192,192,0.4)' }],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </div>
        );
      case t('Revenue per Material Type'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Revenue per Material Type Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Material A')}:
                <input
                  type="number"
                  value={revenueData[0]}
                  onChange={(e) =>
                    setRevenueData([parseFloat(e.target.value), revenueData[1], revenueData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Material B')}:
                <input
                  type="number"
                  value={revenueData[1]}
                  onChange={(e) =>
                    setRevenueData([revenueData[0], parseFloat(e.target.value), revenueData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Material C')}:
                <input
                  type="number"
                  value={revenueData[2]}
                  onChange={(e) =>
                    setRevenueData([revenueData[0], revenueData[1], parseFloat(e.target.value)])
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <Pie
                data={{
                  labels: [t('Material A'), t('Material B'), t('Material C')],
                  datasets: [
                    {
                      data: revenueData,
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </div>
        );
      case t('Gross Profit Margin'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Gross Profit Margin Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Q1')}:
                <input
                  type="number"
                  value={profitMarginData[0]}
                  onChange={(e) =>
                    setProfitMarginData([parseFloat(e.target.value), profitMarginData[1], profitMarginData[2], profitMarginData[3]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Q2')}:
                <input
                  type="number"
                  value={profitMarginData[1]}
                  onChange={(e) =>
                    setProfitMarginData([profitMarginData[0], parseFloat(e.target.value), profitMarginData[2], profitMarginData[3]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Q3')}:
                <input
                  type="number"
                  value={profitMarginData[2]}
                  onChange={(e) =>
                    setProfitMarginData([profitMarginData[0], profitMarginData[1], parseFloat(e.target.value), profitMarginData[3]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Q4')}:
                <input
                  type="number"
                  value={profitMarginData[3]}
                  onChange={(e) =>
                    setProfitMarginData([profitMarginData[0], profitMarginData[1], profitMarginData[2], parseFloat(e.target.value)])
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <Line
                data={{
                  labels: [t('Q1'), t('Q2'), t('Q3'), t('Q4')],
                  datasets: [
                    {
                      label: t('Gross Profit Margin'),
                      data: profitMarginData,
                      fill: false,
                      backgroundColor: 'rgb(75, 192, 192)',
                      borderColor: 'rgba(75, 192, 192, 0.2)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </div>
        );
      case t('Inventory Aging'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Inventory Aging Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Row 1')}:
                <input
                  type="text"
                  value={inventoryAgingData[0]}
                  onChange={(e) =>
                    setInventoryAgingData([e.target.value.split(',').map(Number), inventoryAgingData[1], inventoryAgingData[2]])
                  }
                  placeholder={t('Comma-separated values')}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Row 2')}:
                <input
                  type="text"
                  value={inventoryAgingData[1]}
                  onChange={(e) =>
                    setInventoryAgingData([inventoryAgingData[0], e.target.value.split(',').map(Number), inventoryAgingData[2]])
                  }
                  placeholder={t('Comma-separated values')}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Row 3')}:
                <input
                  type="text"
                  value={inventoryAgingData[2]}
                  onChange={(e) =>
                    setInventoryAgingData([inventoryAgingData[0], inventoryAgingData[1], e.target.value.split(',').map(Number)])
                  }
                  placeholder={t('Comma-separated values')}
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <HeatMapGrid
                data={inventoryAgingData}
                cellStyle={(x, y, ratio) => ({
                  background: `rgba(0, 151, 230, ${ratio})`,
                  fontSize: '12px',
                  color: `rgba(0, 0, 0, ${Math.min(1, ratio + 0.2)})`,
                })}
                cellHeight="30px"
                square
              />
            </div>
          </div>
        );
      case t('Supplier Performance'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Supplier Performance Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Supplier A - Cost')}:
                <input
                  type="number"
                  value={supplierPerformanceData.dataA[0]}
                  onChange={(e) =>
                    setSupplierPerformanceData({
                      ...supplierPerformanceData,
                      dataA: [parseFloat(e.target.value), supplierPerformanceData.dataA[1], supplierPerformanceData.dataA[2]],
                    })
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Supplier A - Quality')}:
                <input
                  type="number"
                  value={supplierPerformanceData.dataA[1]}
                  onChange={(e) =>
                    setSupplierPerformanceData({
                      ...supplierPerformanceData,
                      dataA: [supplierPerformanceData.dataA[0], parseFloat(e.target.value), supplierPerformanceData.dataA[2]],
                    })
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Supplier A - Reliability')}:
                <input
                  type="number"
                  value={supplierPerformanceData.dataA[2]}
                  onChange={(e) =>
                    setSupplierPerformanceData({
                      ...supplierPerformanceData,
                      dataA: [supplierPerformanceData.dataA[0], supplierPerformanceData.dataA[1], parseFloat(e.target.value)],
                    })
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Supplier B - Cost')}:
                <input
                  type="number"
                  value={supplierPerformanceData.dataB[0]}
                  onChange={(e) =>
                    setSupplierPerformanceData({
                      ...supplierPerformanceData,
                      dataB: [parseFloat(e.target.value), supplierPerformanceData.dataB[1], supplierPerformanceData.dataB[2]],
                    })
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Supplier B - Quality')}:
                <input
                  type="number"
                  value={supplierPerformanceData.dataB[1]}
                  onChange={(e) =>
                    setSupplierPerformanceData({
                      ...supplierPerformanceData,
                      dataB: [supplierPerformanceData.dataB[0], parseFloat(e.target.value), supplierPerformanceData.dataB[2]],
                    })
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Supplier B - Reliability')}:
                <input
                  type="number"
                  value={supplierPerformanceData.dataB[2]}
                  onChange={(e) =>
                    setSupplierPerformanceData({
                      ...supplierPerformanceData,
                      dataB: [supplierPerformanceData.dataB[0], supplierPerformanceData.dataB[1], parseFloat(e.target.value)],
                    })
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <Radar
                data={{
                  labels: supplierPerformanceData.labels,
                  datasets: [
                    {
                      label: t('Supplier A'),
                      data: supplierPerformanceData.dataA,
                      backgroundColor: 'rgba(34, 202, 236, 0.2)',
                      borderColor: 'rgba(34, 202, 236, 1)',
                    },
                    {
                      label: t('Supplier B'),
                      data: supplierPerformanceData.dataB,
                      backgroundColor: 'rgba(34, 139, 34, 0.2)',
                      borderColor: 'rgba(34, 139, 34, 1)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </div>
        );
      case t('Material Quality Rating'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Material Quality Rating Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Material A')}:
                <input
                  type="number"
                  value={materialQualityData[0]}
                  onChange={(e) =>
                    setMaterialQualityData([parseFloat(e.target.value), materialQualityData[1], materialQualityData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Material B')}:
                <input
                  type="number"
                  value={materialQualityData[1]}
                  onChange={(e) =>
                    setMaterialQualityData([materialQualityData[0], parseFloat(e.target.value), materialQualityData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Material C')}:
                <input
                  type="number"
                  value={materialQualityData[2]}
                  onChange={(e) =>
                    setMaterialQualityData([materialQualityData[0], materialQualityData[1], parseFloat(e.target.value)])
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <Bar
                data={{
                  labels: [t('Material A'), t('Material B'), t('Material C')],
                  datasets: [{ label: t('Quality Rating'), data: materialQualityData, backgroundColor: 'rgba(255, 205, 86, 0.6)' }],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </div>
        );
      case t('Order Fulfillment Rate'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Order Fulfillment Rate Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Fulfillment Rate (%)')}:
                <input
                  type="number"
                  value={orderFulfillmentRate}
                  onChange={(e) => setOrderFulfillmentRate(parseFloat(e.target.value))}
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <CircularProgressbar value={orderFulfillmentRate} text={`${orderFulfillmentRate}%`} />
            </div>
          </div>
        );
      case t('Environmental Impact Metrics'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Environmental Impact Metrics Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('Carbon Reduction')}:
                <input
                  type="number"
                  value={environmentalImpactData[0]}
                  onChange={(e) =>
                    setEnvironmentalImpactData([parseFloat(e.target.value), environmentalImpactData[1], environmentalImpactData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Energy Savings')}:
                <input
                  type="number"
                  value={environmentalImpactData[1]}
                  onChange={(e) =>
                    setEnvironmentalImpactData([environmentalImpactData[0], parseFloat(e.target.value), environmentalImpactData[2]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('Water Savings')}:
                <input
                  type="number"
                  value={environmentalImpactData[2]}
                  onChange={(e) =>
                    setEnvironmentalImpactData([environmentalImpactData[0], environmentalImpactData[1], parseFloat(e.target.value)])
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <Bar
                data={{
                  labels: [t('Carbon Reduction'), t('Energy Savings'), t('Water Savings')],
                  datasets: [
                    {
                      label: t('Impact'),
                      data: environmentalImpactData,
                      backgroundColor: ['#66bb6a', '#ffa726', '#29b6f6'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </div>
        );
      case t('Operational Efficiency'):
        return (
          <div style={styles.container}>
            <h3 style={styles.sectionTitle}>{t('Operational Efficiency Details')}</h3>
            <div style={styles.inputContainer}>
              <label style={styles.label}>
                {t('January')}:
                <input
                  type="number"
                  value={operationalEfficiencyData[0]}
                  onChange={(e) =>
                    setOperationalEfficiencyData([parseFloat(e.target.value), operationalEfficiencyData[1], operationalEfficiencyData[2], operationalEfficiencyData[3]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('February')}:
                <input
                  type="number"
                  value={operationalEfficiencyData[1]}
                  onChange={(e) =>
                    setOperationalEfficiencyData([operationalEfficiencyData[0], parseFloat(e.target.value), operationalEfficiencyData[2], operationalEfficiencyData[3]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('March')}:
                <input
                  type="number"
                  value={operationalEfficiencyData[2]}
                  onChange={(e) =>
                    setOperationalEfficiencyData([operationalEfficiencyData[0], operationalEfficiencyData[1], parseFloat(e.target.value), operationalEfficiencyData[3]])
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                {t('April')}:
                <input
                  type="number"
                  value={operationalEfficiencyData[3]}
                  onChange={(e) =>
                    setOperationalEfficiencyData([operationalEfficiencyData[0], operationalEfficiencyData[1], operationalEfficiencyData[2], parseFloat(e.target.value)])
                  }
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.chartContainer}>
              <Line
                data={{
                  labels: [t('Jan'), t('Feb'), t('Mar'), t('Apr')],
                  datasets: [
                    {
                      label: t('Efficiency'),
                      data: operationalEfficiencyData,
                      fill: false,
                      backgroundColor: '#ab47bc',
                      borderColor: '#ab47bc',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </div>
        );
      default:
        return (
          <div style={styles.kpiContainer}>
            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Inventory Turnover Ratio'))}
            >
              <h3>{t('Inventory Turnover Ratio')}</h3>
              <CircularProgressbar value={70} text={`7.0`} />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Material Acquisition Cost'))}
            >
              <h3>{t('Material Acquisition Cost')}</h3>
              <Bar
                data={{
                  labels: [t('Jan'), t('Feb'), t('Mar')],
                  datasets: [{ label: t('Cost'), data: materialAcquisitionData, backgroundColor: 'rgba(75,192,192,0.4)' }],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Revenue per Material Type'))}
            >
              <h3>{t('Revenue per Material Type')}</h3>
              <Pie
                data={{
                  labels: [t('Material A'), t('Material B'), t('Material C')],
                  datasets: [
                    {
                      data: revenueData,
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Gross Profit Margin'))}
            >
              <h3>{t('Gross Profit Margin')}</h3>
              <Line
                data={{
                  labels: [t('Q1'), t('Q2'), t('Q3'), t('Q4')],
                  datasets: [
                    {
                      label: t('Gross Profit Margin'),
                      data: profitMarginData,
                      fill: false,
                      backgroundColor: 'rgb(75, 192, 192)',
                      borderColor: 'rgba(75, 192, 192, 0.2)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Inventory Aging'))}
            >
              <h3>{t('Inventory Aging')}</h3>
              <HeatMapGrid
                data={inventoryAgingData}
                cellStyle={(x, y, ratio) => ({
                  background: `rgba(0, 151, 230, ${ratio})`,
                  fontSize: '12px',
                  color: `rgba(0, 0, 0, ${Math.min(1, ratio + 0.2)})`,
                })}
                cellHeight="30px"
                square
              />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Supplier Performance'))}
            >
              <h3>{t('Supplier Performance')}</h3>
              <Radar
                data={{
                  labels: supplierPerformanceData.labels,
                  datasets: [
                    {
                      label: t('Supplier A'),
                      data: supplierPerformanceData.dataA,
                      backgroundColor: 'rgba(34, 202, 236, 0.2)',
                      borderColor: 'rgba(34, 202, 236, 1)',
                    },
                    {
                      label: t('Supplier B'),
                      data: supplierPerformanceData.dataB,
                      backgroundColor: 'rgba(34, 139, 34, 0.2)',
                      borderColor: 'rgba(34, 139, 34, 1)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Material Quality Rating'))}
            >
              <h3>{t('Material Quality Rating')}</h3>
              <Bar
                data={{
                  labels: [t('Material A'), t('Material B'), t('Material C')],
                  datasets: [{ label: t('Quality Rating'), data: materialQualityData, backgroundColor: 'rgba(255, 205, 86, 0.6)' }],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Order Fulfillment Rate'))}
            >
              <h3>{t('Order Fulfillment Rate')}</h3>
              <CircularProgressbar value={orderFulfillmentRate} text={`${orderFulfillmentRate}%`} />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Environmental Impact Metrics'))}
            >
              <h3>{t('Environmental Impact Metrics')}</h3>
              <Bar
                data={{
                  labels: [t('Carbon Reduction'), t('Energy Savings'), t('Water Savings')],
                  datasets: [
                    {
                      label: t('Impact'),
                      data: environmentalImpactData,
                      backgroundColor: ['#66bb6a', '#ffa726', '#29b6f6'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            <div
              style={styles.kpiCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => handleKPIClick(t('Operational Efficiency'))}
            >
              <h3>{t('Operational Efficiency')}</h3>
              <Line
                data={{
                  labels: [t('Jan'), t('Feb'), t('Mar'), t('Apr')],
                  datasets: [
                    {
                      label: t('Efficiency'),
                      data: operationalEfficiencyData,
                      fill: false,
                      backgroundColor: '#ab47bc',
                      borderColor: '#ab47bc',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            {/* Additional KPI Cards can be added here */}
          </div>
        );
    }
  };

  return (
    <div style={styles.pageContainer}>
  {/* Render input sections based on selectedKPI */}
  {selectedKPI === t('Inventory Turnover Ratio') && (
    <div style={styles.inputSection}>
      <h2 style={styles.inputHeader}>{t('Inventory Turnover Ratio')}</h2>
      <div style={styles.inputGroup}>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Inventory levels')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter inventory levels')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Sales data')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter sales data')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Period length (days, weeks, months)')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter period length')} />
        </div>
      </div>
      <button style={styles.submitButton}>{t('Submit')}</button>
    </div>
  )}

  {selectedKPI === t('Material Acquisition Cost') && (
    <div style={styles.inputSection}>
      <h2 style={styles.inputHeader}>{t('Material Acquisition Cost')}</h2>
      <div style={styles.inputGroup}>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Purchase orders')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter purchase orders')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Acquisition costs per material')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter acquisition costs')} />
        </div>
      </div>
      <button style={styles.submitButton}>{t('Submit')}</button>
    </div>
  )}

  {selectedKPI === t('Revenue per Material Type') && (
    <div style={styles.inputSection}>
      <h2 style={styles.inputHeader}>{t('Revenue per Material Type')}</h2>
      <div style={styles.inputGroup}>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Sales data categorized by material type')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter sales data by material type')} />
        </div>
      </div>
      <button style={styles.submitButton}>{t('Submit')}</button>
    </div>
  )}

  {selectedKPI === t('Gross Profit Margin') && (
    <div style={styles.inputSection}>
      <h2 style={styles.inputHeader}>{t('Gross Profit Margin')}</h2>
      <div style={styles.inputGroup}>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Revenue')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter revenue')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Cost of goods sold (COGS)')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter COGS')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Expenses')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter expenses')} />
        </div>
      </div>
      <button style={styles.submitButton}>{t('Submit')}</button>
    </div>
  )}

  {selectedKPI === t('Inventory Aging') && (
    <div style={styles.inputSection}>
      <h2 style={styles.inputHeader}>{t('Inventory Aging')}</h2>
      <div style={styles.inputGroup}>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Inventory dates')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter inventory dates')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Purchase dates')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter purchase dates')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Sales dates')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter sales dates')} />
        </div>
      </div>
      <button style={styles.submitButton}>{t('Submit')}</button>
    </div>
  )}

  {selectedKPI === t('Order Fulfillment Rate') && (
    <div style={styles.inputSection}>
      <h2 style={styles.inputHeader}>{t('Order Fulfillment Rate')}</h2>
      <div style={styles.inputGroup}>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Order data')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter order data')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Delivery data')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter delivery data')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Fulfillment dates')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter fulfillment dates')} />
        </div>
      </div>
      <button style={styles.submitButton}>{t('Submit')}</button>
    </div>
  )}

  {selectedKPI === t('Environmental Impact Metrics') && (
    <div style={styles.inputSection}>
      <h2 style={styles.inputHeader}>{t('Environmental Impact Metrics')}</h2>
      <div style={styles.inputGroup}>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Recycling data')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter recycling data')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Emissions data')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter emissions data')} />
        </div>
        <div style={styles.inputField}>
          <label style={styles.label}>{t('Energy usage')}:</label>
          <input type="text" style={styles.input} placeholder={t('Enter energy usage')} />
        </div>
      </div>
      <button style={styles.submitButton}>{t('Submit')}</button>
    </div>
  )}

  <h2 style={styles.sectionTitle}>{t('Analytics & Reports')}</h2>
  {renderKPICard()}

  <div style={styles.backButtonContainer}>
    {selectedKPI && (
      <button
        style={styles.backButton}
        onMouseEnter={(e) => (e.target.style.backgroundColor = styles.backButtonHover.backgroundColor)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = styles.backButton.backgroundColor)}
        onClick={() => setSelectedKPI(null)}
      >
        {t('Back to Dashboard')}
      </button>
    )}
  </div>
</div>

  );
};

export default AnalyticsAndReports;
