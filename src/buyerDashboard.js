import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageIcon from './languages.png';
import i18n from './languageTranslate.js';

import GreenCycleLogo from './greenCyclelogo.png';

import ListIcon from './list.png';
import DoubleArrowIcon from './leftArrow.png'; // Assuming you have an icon for the double arrow

import Modal from 'react-modal';

import SellYourRecyclables from './scrapBuyerOrder.js';
import AnalyticsAndReports from './scrapBuyerAnalytics.js';

import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';


import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar's CSS

import './customCalanderStylings.css'; // Your custom styles


// Register the components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);




const ScrapBuyerDashboard = () => {
  const { t } = useTranslation();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard'); // To manage active section

  const [scrapBuyer, setScrapBuyer] = useState(null);

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null); // Moved to top level
  const [editingItem, setEditingItem] = useState(null); // Moved to top level
  const [editedPrice, setEditedPrice] = useState(''); // Moved to top level

  // New state for modal and paid amounts
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paidAmounts, setPaidAmounts] = useState({});

  const [quantities, setQuantities] = useState({});

  const navigate = useNavigate();

  const [rechargeAmount, setRechargeAmount] = useState('');

  const [selectedInventoryCategory, setSelectedInventoryCategory] = useState(null);

   // New state for pie and bar chart data
   const [pieData, setPieData] = useState(null);
   const [barData, setBarData] = useState(null);

   // Add this new state to handle the selected date
    const [selectedDate, setSelectedDate] = useState(new Date());


   const pieChartRef = useRef(null);

   const [categoryTableData, setCategoryTableData] = useState([]);
  const [itemTableData, setItemTableData] = useState([]);


  

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#e0f7da',
      height: '100vh',
      padding: '4px',
      boxSizing: 'border-box',
      position: 'relative',
      overflowY: 'auto', // Ensure content doesn't overflow
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#9C27B0',
      padding: '10px 20px',
      borderRadius: '5px',
      color: 'white',
      marginBottom: '10px',
      position: 'relative',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    logo: {
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    languageIcon: {
      cursor: 'pointer',
      width: '30px',
      height: '30px',
    },
    dropdown: {
      position: 'absolute',
      top: '50px',
      right: '10px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      display: showDropdown ? 'block' : 'none',
      
    },
    dropdownItem: {
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#333',
      borderBottom: '1px solid #eee',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    contentSection: {
      marginTop: '10px',
      padding: '4px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 1, // Ensure it's above the main container background
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: showSidebar ? 0 : '-30vh', // Sidebar slides in and out
      width: '30vh',
      height: '100%',
      backgroundColor: '#6A1B9A',
      color: 'white',
      transition: 'left 0.3s ease',
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '60px',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
      
    },
    sidebarItem: {
      width: '100%',
      padding: '15px 0',
      textAlign: 'center',
      fontSize: '12px',
      cursor: 'pointer',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      transition: 'background-color 0.3s, transform 0.3s',
      position: 'relative',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    sidebarItemHover: {
      backgroundColor: '#7B1FA2',
      transform: 'translateX(5px)',
    },
    sidebarItemActive: {
      backgroundColor: '#9C27B0',
    },
    closeIcon: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      cursor: 'pointer',
      width: '24px',
      height: '24px',
    },
    metricsPanel: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      margin: '10px',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    metricCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out',

    },
    metricCardHover: {
      transform: 'translateY(-5px)', // Subtle lift on hover
    },
    metricTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#4A4A4A',
      marginBottom: '10px',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    metricValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1E88E5',
    },
    notificationsPanel: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    notificationTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#4A4A4A',
      marginBottom: '15px',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    notificationText: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '10px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333',
      display: 'flex', // Use flexbox to align items
      justifyContent: 'space-between', // Space between the title and the icon
      alignItems: 'center', // Vertically center align the items
      cursor: 'pointer', // Indicate that this section is clickable
      position: 'relative', // Positioning context for absolute elements
    },
    orderItem: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', // Ensure content is hidden during collapse
      marginBottom: '15px', // Add some space between items
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #e0e0e0',
      paddingBottom: '10px',
      marginBottom: '10px',
      textAlign: 'left',
      cursor: 'pointer', // Make cursor pointer to indicate clickability
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    orderContentWrapper: {
      overflow: 'hidden',
      transition: 'max-height 0.6s ease, padding 0.6s ease', // Smooth transition for height and padding
    },
    // orderContent: {
    //   display: 'flex',
    //   justifyContent: 'space-between',
    //   alignItems: 'flex-start',
    //   padding: '10px 0',
    // },

    
    orderId: {
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#4A4A4A',
      marginRight: '10px',
    },
    orderStatus: {
      fontSize: '12px',
      color: '#c0726e',
      fontWeight: 'bold',
      marginRight: '5px',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    orderContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      maxHeight: '600px', // Set max-height for the order content
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    orderDetails: {
      flex: 2,
      paddingRight: '10px',
      textAlign: 'left', // Ensure text is aligned to the left
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    detailText: {
      marginBottom: '4px',
      fontSize: '12px',
      color: '#333',
      lineHeight: '1.6',
      textAlign: 'left', // Ensure text is aligned to the left
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    cartList: {
      listStyleType: 'none', // Remove bullet points
      padding: '0',
      margin: '8px 0',
      maxHeight: '150px', // Set a max-height for the cart list
      overflowY: 'auto', // Make cart list scrollable if it overflows
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      padding: '6px',
    },
    cartItem: {
      display: 'flex',
      alignItems: 'center', // Align items horizontally
      marginBottom: '10px',
      padding: '6px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    cartItemImage: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover',
      marginRight: '15px', // Space between image and text
    },
    cartItemDetails: {
      display: 'flex',
      flexDirection: 'column',

    },
    cartItemText: {
      margin: '5px 0',
      fontSize: '11px',
      color: '#555',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    imagesContainer: {
      display: 'flex',
      marginTop: '10px',
      gap: '10px',
    },
    orderImage: {
      width: '100px',
      height: '100px',
      borderRadius: '8px',
      objectFit: 'cover',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    },
    actionButtons: {
      marginTop: '30px',
      display: 'flex',
      textAlign: 'center',
      flexDirection: 'column',
      gap: '10px',
    },
    acceptButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'background-color 0.3s ease',
    },
    rejectButton: {
      backgroundColor: '#b2b5be',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'background-color 0.3s ease',
    },
    toggleIcon: {
      fontSize: '32px',
      color: '#bfd891',
      marginLeft: '10px',
      transition: 'transform 0.3s ease',
      position: 'absolute', // Position the icon absolutely
      right: '0px', // Align to the right edge of the parent
    },
    
    completeButtonHover: {
      backgroundColor: '#1976D2',
    },

    actionButtons: {
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'row', // Display buttons side by side
      gap: '10px',
    },
    trackButton: {
      backgroundColor: '#5dbea3',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'background-color 0.3s ease',
    },
   
    trackButtonHover: {
      backgroundColor: '#FF8F00',
    },

    completeButton: {
      backgroundColor: '#1E88E5',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'background-color 0.3s ease',
    },
    acceptButtonHover: {
      backgroundColor: '#45A049',
    },
    rejectButtonHover: {
      backgroundColor: '#E53935',
    },

    pricingContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '10px',
    },
    materialCard: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    materialCategory: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '12px',
      color: '#4A4A4A',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    itemsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
    itemCard: {
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      padding: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    itemImage: {
      width: '100px',
      height: '100px',
      borderRadius: '8px',
      objectFit: 'cover',
      marginBottom: '10px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    },
    itemName: {
      fontSize: '12px',
      color: '#333',
      marginBottom: '5px',
    },
    itemPrice: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#1E88E5',
    },
    noMaterialsText: {
      fontSize: '14px',
      color: '#999',
      textAlign: 'center',
    },

    categoriesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '10px',
      marginBottom: '10px',
    },
    categoryTile: {
      padding: '10px 15px',
      borderRadius: '5px',
      backgroundColor: '#E0E0E0',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
    },
    categoryTileActive: {
      backgroundColor: '#9C27B0',
      color: 'white',
    },
    editContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    priceInput: {
      padding: '5px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '12px',
    },
    saveButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'background-color 0.3s ease',
    },
    editButton: {
      backgroundColor: '#FFC107',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginLeft: '10px',
      fontSize: '12px',
      transition: 'background-color 0.3s ease',
    },

    
  modalOverlay: {
    position: 'fixed',

    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Darken the background
    zIndex: 2000, // Ensure overlay is above other components
  },
  modalContent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    height: '60%',
    margin: '20px',
    borderRadius: '8px',
    zIndex: 2100, // Ensure the modal content is above the overlay
    width: '300px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0)', // Add a shadow for better visibility
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#E53935',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  priceInput: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  },
  modalContentWrapper: {
    margin: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },

  walletContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '12px',
    fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
  },
  walletSection: {
    backgroundColor: '#ffffff',
    padding: '8px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  sectionHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#333',
    fontFamily: "'Noto Sans Telugu', Arial, sans-serif",
  },
  rechargeButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    marginLeft: '6px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  generateInvoiceButton: {
    backgroundColor: '#1976D2',
    color: '#fff',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },

  rechargeInput: {
    width: '60%',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  transactionList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '15px',
  },
  transactionItem: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
  },
  transactionItemHover: {
    transform: 'translateY(-3px)',
  },
  transactionText: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '5px',
  },
  noTransactionsText: {
    fontSize: '13px',
    color: '#999',
    textAlign: 'center',
  },


  chartsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px', // Space between the charts
    padding: '5px',
    backgroundColor: '#F9F9F9', // Light background to contrast with the charts
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
    width: '95%', // Ensure it takes up the full width of the container
    maxWidth: '95vw', // Limit the maximum width to make it responsive
    margin: '0 auto', // Center the container on the page
  },
  chart: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // More prominent shadow for individual charts
    width: '100%', // Ensure charts take up full width of the container
    maxWidth: '90vw', // Limit the maximum width of each chart
    transition: 'transform 0.3s ease-in-out', // Smooth transition for hover effect
  },
  chartTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  '@media (min-width: 768px)': {
    chartsContainer: {
      flexDirection: 'column', // Keep column direction on larger screens
    },
    chart: {
      maxWidth: '80%', // Make charts wider on larger screens
    },
  },
  '@media (max-width: 767px)': {
    chartsContainer: {
      flexDirection: 'column', // Keep column direction on smaller screens
    },
    chart: {
      maxWidth: '80%', // Make charts take up full width on smaller screens
    },
  },


  table: {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'separate',
    borderSpacing: '0 15px',
  },
  tableHeader: {
    backgroundColor: '#6200ea', // A deep purple background for headers
    color: 'white',
    borderBottom: '2px solid #ddd',
  },
  tableRow: {
    backgroundColor: '#f4f4f4', // A light grey background for rows
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for the rows
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  tableCell: {
    padding: '7px 10px',
    textAlign: 'left',
    fontSize: '12px',
    color: '#333',
    borderBottom: '1px solid #ddd',
  },
  tableRowHover: {
    transform: 'translateY(-3px)', // Slight lift on hover
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // Increase shadow on hover
  },
  tableHeaderCell: {
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  },

  };



  useEffect(() => {
    if (scrapBuyer && activeSection === 'Dashboard') {
      const categoryData = scrapBuyer.inventory.map((inventoryCategory) => ({
        category: inventoryCategory.category,
        volume: inventoryCategory.items.reduce((total, item) => total + item.quantity, 0),
        value: inventoryCategory.items.reduce((total, item) => total + item.paidAmount, 0),
      }));
  
      setPieData({
        labels: categoryData.map((data) => data.category),
        datasets: [
          {
            data: categoryData.map((data) => data.volume),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
          },
        ],
      });
  
      setCategoryTableData(categoryData); // Store the category data for the table
    }
  }, [scrapBuyer, activeSection]);
  


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAgentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting current location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    fetchOrders();
  }, []);


  const fetchOrders = async () => {
    const scrapBuyerId = localStorage.getItem('scrapBuyerId'); // Retrieve scrapBuyerId from localStorage
  
    if (!scrapBuyerId) {
      console.error('Scrap Buyer ID not found in local storage');
      return;
    }
  
    try {
      // Fetch Scrap Buyer Data
      const scrapBuyerResponse = await axios.get(`https://recycle-backend-lflh.onrender.com/api/scrap-buyers/${scrapBuyerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      const scrapBuyer = scrapBuyerResponse.data;
      setScrapBuyer(scrapBuyer); // Update state with the scrap buyer data
      console.log('scrapBuyer..', scrapBuyer);
  
      // Assuming scrapBuyer has fields for currentOrders and completedOrders
      const currentOrders = scrapBuyer.currentOrders || [];
      const completedOrders = scrapBuyer.completedOrders || [];
  
      // Function to fetch additional details for each order
      const fetchOrderDetails = async (orderId) => {
        try {
          const orderDetailsResponse = await axios.get(`https://recycle-backend-lflh.onrender.com/getorderbyid/${orderId}`);
          const orderDetails = orderDetailsResponse.data;
          return {
            id: orderDetails.Id,
            name: orderDetails.name,
            images: orderDetails.images || [],
            schedulePickup: orderDetails.schedulePickup,
            totalWeight: orderDetails.totalWeight,
            cart: orderDetails.cart,
            status: orderDetails.status || 'Unknown',
            priority: orderDetails.priority || 'Medium',
            address: {
              lat: orderDetails.location.latitude || 'N/A',
              lng: orderDetails.location.longitude || 'N/A',
              address: orderDetails.location.address || 'Unknown',
            },
          };
        } catch (error) {
          console.error(`Error fetching details for order ${orderId}:`, error);
          return null;
        }
      };
  
      // Fetch detailed information for each current order
      const currentOrdersWithDetails = await Promise.all(
        currentOrders.map(async (order) => {
          const orderDetails = await fetchOrderDetails(order.orderId);
          return orderDetails;
        })
      );
  
      // Update state with the fetched orders and their details
      setCurrentOrders(currentOrdersWithDetails.filter(order => order !== null));
      console.log('currentOrders with details:', currentOrdersWithDetails);
  
      setCompletedOrders(completedOrders.map(order => ({
        id: order.orderId,
        completedDate: order.completedDate,
        totalWeight: order.totalWeight,
        totalPrice: order.totalPrice,
      })));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };



  // Function to filter orders based on the selected date
const filterOrdersByDate = (orders) => {
  return orders.filter(order => {
    const orderDate = new Date(order.schedulePickup);
    return (
      orderDate.getDate() === selectedDate.getDate() &&
      orderDate.getMonth() === selectedDate.getMonth() &&
      orderDate.getFullYear() === selectedDate.getFullYear()
    );
  });
};

// Function to get the pending orders count for a specific date
const getPendingOrdersCountForDate = (date) => {
  return currentOrders.filter(order => {
    const orderDate = new Date(order.schedulePickup);
    return (
      order.status === 'Pending' &&
      orderDate.getDate() === date.getDate() &&
      orderDate.getMonth() === date.getMonth() &&
      orderDate.getFullYear() === date.getFullYear()
    );
  }).length;
};

const tileContent = ({ date, view }) => {
  if (view === 'month') {
    const count = getPendingOrdersCountForDate(date);
    return count > 0 ? (
      <div className="order-count-container">
        <div className="order-count-bubble">{count}</div>
      </div>
    ) : null;
  }
};





  // ----------------------------------------- googleMapsUrl -------------------------------------------------------
  const trackOrder = (order) => {
    const { lat, lng } = order.address;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleQuantityChange = (itemId, quantity, price) => {
    const numericQuantity = Number(quantity);
  
    // Update the quantity
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: numericQuantity,
    }));
  
    // Calculate the paid amount based on quantity and price
    const calculatedPaidAmount = numericQuantity * price;
  
    // Update the paid amount
    setPaidAmounts((prevAmounts) => ({
      ...prevAmounts,
      [itemId]: calculatedPaidAmount,
    }));
  };
  
  


  const toggleOrderContent = (orderId) => {
    setExpandedOrderId(prevOrderId => (prevOrderId === orderId ? null : orderId));
  };


  const openModal = (order) => {
    setSelectedOrder(order);
    const initialPaidAmounts = order.cart.reduce((acc, item) => {
      acc[item.itemId] = item.price; // Default paidAmount to item price
      return acc;
    }, {});
    setPaidAmounts(initialPaidAmounts);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePaidAmountChange = (itemId, amount) => {
    setPaidAmounts((prevAmounts) => ({
      ...prevAmounts,
      [itemId]: amount,
    }));
  };

  const handleConfirmOrder = () => {
    // Handle complete order logic here, pass paidAmounts to handleCompleteOrder
    handleCompleteOrder(selectedOrder, paidAmounts);
    closeModal();
  };


  
  const handleStartOrder = async (order) => {
    try {
      // API call to update the status in the currentOrders
      const updateCurrentOrdersResponse = await axios.post('https://recycle-backend-lflh.onrender.com/api/scrap-buyers/update-order-status', {
        orderId: order.id,
        status: 'inProgress',
      });
  
      // API call to update the status in the scrap_orders schema
      const updateScrapOrdersResponse = await axios.post('https://recycle-backend-lflh.onrender.com/api/scrap-orders/update-status', {
        id: order.id,
        status: 'inProgress',
      });
  
      if (updateCurrentOrdersResponse.status === 200 && updateScrapOrdersResponse.status === 200) {
        // Update the local state only if both API calls were successful
        setCurrentOrders(prevOrders => prevOrders.map(o =>
          o.id === order.id ? { ...o, status: 'inProgress' } : o
        ));
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error("Error starting order:", error);
    }
  };
  

  const handleCompleteOrder = async (order) => {
    try {
      // Update order status in scrap-buyers
      await axios.post('https://recycle-backend-lflh.onrender.com/api/scrap-buyers/update-order-status', {
        orderId: order.id,
        status: 'completed',
      });
  
      const updatedItems = order.cart.map(item => ({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        Est_quantity: item.quantity,
        paidAmount: paidAmounts[item.itemId], // Paid amount calculated based on quantity
        quantity: quantities[item.itemId] || item.quantity, // Quantity updated by user
        imageUrl: item.imageUrl,
      }));
      console.log('updatedItems',updatedItems)
      // API call to update the order status and cart items in scrap-orders
      const res = await axios.post('https://recycle-backend-lflh.onrender.com/api/scrap-orders/update-status', {
        id: order.id,
        status: 'completed',
        updatedItems, // Sending the updated items
      });
  
      if (res.status === 200) { 
        console.log('Order status and cart updated successfully', res.data);
      }
  
      // Handle the response from the completepickup API
      const response = await axios.put('https://recycle-backend-lflh.onrender.com/scrap-buyer/completepickup', {
        id: order.id,
        status: 'completed',
        items: updatedItems,
      });
  
      console.log('updatedItems', updatedItems);
      if (response.status === 200) {
        // Update the state to remove the completed order from currentOrders
        setCurrentOrders((prevOrders) =>
          prevOrders.filter((o) => o.id !== order.id)
        );
        
        // Optionally update completed orders list
        setCompletedOrders((prevOrders) => [...prevOrders, response.data.order]);
        console.log('Order completed successfully');
      } else {
        console.error('Failed to complete the order');
      }
    } catch (error) {
      console.error("Error completing the order:", error);
    }
  };
  



  const initiatePaymentGateway = (amount) => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Enter the Key ID generated from the Razorpay Dashboard
      amount: amount * 100, // Amount is in the smallest currency unit. For INR, it is paise.
      currency: 'INR',
      name: 'GreenCycle',
      description: 'Add funds to wallet',
      image: GreenCycleLogo, // Replace with your logo URL
      handler: function (response) {
        console.log('Payment successful:', response);
        // Handle post-payment actions here, like updating the wallet balance
        handlePaymentSuccess(response);
      },
      prefill: {
        name: 'User Name', // You can get the user's name from your app's state
        email: 'user@example.com', // You can get the user's email from your app's state
        contact: '9999999999', // You can get the user's contact from your app's state
      },
      notes: {
        address: 'Your Company Address',
      },
      theme: {
        color: '#F37254', // Customize the color of the payment modal
      },
    };
  
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  
    rzp1.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      // Optionally handle payment failure here
    });
  };
  
  const handlePaymentSuccess = (response) => {
    // Example function to handle post-payment actions
    console.log('Payment ID:', response.razorpay_payment_id);
    console.log('Order ID:', response.razorpay_order_id);
    console.log('Signature:', response.razorpay_signature);
  
    // Here you would typically send the payment details to your server to verify the payment
    // and update the user's wallet balance
  };


  const handleAddFunds = () => {
    if (rechargeAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Initiate payment gateway logic here
    initiatePaymentGateway(rechargeAmount);
  };


  const handlePieClick = (event) => {
    const chart = pieChartRef.current;
    if (chart) {
      const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
      if (elements.length > 0) {
        const chartElement = elements[0];
        const clickedCategory = pieData.labels[chartElement.index];
        console.log('clickedCategory..',clickedCategory);
        setSelectedInventoryCategory(clickedCategory,scrapBuyer);
      }
    }
  };

  useEffect(() => {
    if (selectedInventoryCategory && scrapBuyer) {
      const selectedInventoryCategoryData = scrapBuyer.inventory.find(
        (inventoryCategory) => inventoryCategory.category === selectedInventoryCategory
      );
  
      const itemData = selectedInventoryCategoryData
        ? selectedInventoryCategoryData.items.map((item) => ({
            name: item.name,
            volume: item.quantity,
            value: item.paidAmount,
          }))
        : [];
  
      setBarData({
        labels: selectedInventoryCategoryData ? selectedInventoryCategoryData.items.map((item) => item.name) : [],
        datasets: [
          {
            label: 'Quantity',
            data: selectedInventoryCategoryData ? selectedInventoryCategoryData.items.map((item) => item.quantity) : [],
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      });
  
      setItemTableData(itemData); // Store the item data for the table
    }
  }, [selectedInventoryCategory, scrapBuyer]);
  
  

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setShowDropdown(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleEditClick = (item) => {
    setEditingItem(item.itemId);
    setEditedPrice(item.buyerPrice.toFixed(2));
  };

  const handleSaveClick = async (item) => {
    try {
      const response = await axios.post(`https://recycle-backend-lflh.onrender.com/api/scrap-buyers/update-price`, {
        itemId: item.itemId,
        buyerPrice: parseFloat(editedPrice),
      });

      if (response.status === 200) {
        setScrapBuyer((prevBuyer) => ({
          ...prevBuyer,
          acceptedMaterials: prevBuyer.acceptedMaterials.map((material) => ({
            ...material,
            items: material.items.map((i) =>
              i.itemId === item.itemId ? { ...i, buyerPrice: parseFloat(editedPrice) } : i
            ),
          })),
        }));
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  if (!scrapBuyer) {
    return <p>{t('Loading...')}</p>; // Display a loading message or spinner
  }

  const filteredMaterials = selectedCategory
    ? scrapBuyer.acceptedMaterials.filter((material) => material.category === selectedCategory)
    : scrapBuyer.acceptedMaterials;







    const renderCategoryTable = () => (
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableHeaderCell}>{t('Category')}</th>
            <th style={styles.tableHeaderCell}>{t('Total Volume')}</th>
            <th style={styles.tableHeaderCell}>{t('Total Value')}</th>
          </tr>
        </thead>
        <tbody>
          {categoryTableData.map((data, index) => (
            <tr
              key={index}
              style={styles.tableRow}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.tableRowHover.transform;
                e.currentTarget.style.boxShadow = styles.tableRowHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <td style={styles.tableCell}>{data.category}</td>
              <td style={styles.tableCell}>{data.volume} kg</td>
              <td style={styles.tableCell}>₹ {data.value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    
    const renderItemTable = () => (
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableHeaderCell}>{t('Item Name')}</th>
            <th style={styles.tableHeaderCell}>{t('Total Volume')}</th>
            <th style={styles.tableHeaderCell}>{t('Total Value')}</th>
          </tr>
        </thead>
        <tbody>
          {itemTableData.map((data, index) => (
            <tr
              key={index}
              style={styles.tableRow}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.tableRowHover.transform;
                e.currentTarget.style.boxShadow = styles.tableRowHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <td style={styles.tableCell}>{data.name}</td>
              <td style={styles.tableCell}>{data.volume} kg</td>
              <td style={styles.tableCell}>₹ {data.value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    




 const renderContentSection = () => {
 

    switch (activeSection) {
      case 'Dashboard':
              

      return (
        <div style={styles.dashboardItem}>
          <div style={styles.metricsPanel}>

          <div style={styles.chartsContainer}>
              {pieData && (
                <div style={styles.chart}>
                  <h4 style={styles.chartTitle}>{t('Recyclable Categories Volume')}</h4>
                  {pieData && <Pie data={pieData} ref={pieChartRef} onClick={handlePieClick} />}
                  {renderCategoryTable()} {/* Render the category table here */}
                </div>
              )}

              {selectedInventoryCategory && barData && (
                <div style={styles.chart}>
                  <h4 style={styles.chartTitle}>{t(`Volume of Sub-categories in ${selectedInventoryCategory}`)}</h4>
                  <Bar
                          data={barData}
                          options={{
                            indexAxis: 'y', // This will make the bar chart horizontal
                            scales: {
                              x: {
                                beginAtZero: true,
                              },
                              y: {
                                beginAtZero: true,
                              },
                            },
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }}
                        />

                  {renderItemTable()} {/* Render the category table here */}
                </div>
              )}
          </div>
            <div style={styles.metricCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={styles.metricTitle}>{t('Active Orders')}</h3>
              <p style={styles.metricValue}>{currentOrders.filter(order => order.status === 'Pending').length}</p>
            </div>
            <div style={styles.metricCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={styles.metricTitle}>{t('Accepted Orders')}</h3>
              <p style={styles.metricValue}>{currentOrders.filter(order => order.status === 'inProgress').length}</p>
            </div>
            <div style={styles.metricCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={styles.metricTitle}>{t('Completed Orders')}</h3>
              <p style={styles.metricValue}>{currentOrders.filter(order => order.status === 'completed').length}</p>
            </div>
            <div style={styles.metricCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={styles.metricTitle}>{t('Earnings')}</h3>
              <p style={styles.metricValue}>₹ 1234</p>
            </div>

            <div style={styles.metricCard}>
              <h3 style={styles.metricTitle}>{t('Wallet Balance')}</h3>
              <p style={styles.metricValue}>
                {scrapBuyer && scrapBuyer.wallet ? `₹ ${scrapBuyer.wallet.balance.toFixed(2)}` : 'Loading...'}
              </p>
            </div>
          </div>

        </div>
      );
      case 'Order Management':
        return (
                    
                <div style={styles.orderList}>
                            {/* // Inside renderContentSection function, replace the calendar render part: */}
                                    <ReactCalendar
                                      onChange={setSelectedDate}
                                      value={selectedDate}
                                      tileContent={tileContent} // Add this line to include bubbles on calendar dates
                                      style={styles.calendar} // Add some styles for better appearance
                                    />
                                {/* Display orders with status 'Pending' */}
                                
                                {currentOrders.filter(order => 
                                  order.status === 'Pending' && 
                                  new Date(order.schedulePickup).toDateString() === selectedDate.toDateString()
                              ).length > 0 ? (
                                  currentOrders.filter(order => 
                                      order.status === 'Pending' && 
                                      new Date(order.schedulePickup).toDateString() === selectedDate.toDateString()
                                  ).map((order) => (
                                      <div key={order.id} style={styles.orderItem}>
                                          <h2 style={styles.sectionTitle}>{t('Pending Orders')}</h2>
                                          <div style={styles.orderHeader}>
                                              <h2 style={styles.orderId}>{`Order ID: ${order.id}`}</h2>
                                              <p style={styles.orderStatus}>{`Status : ${order.status}`}</p>
                                          </div>
                                          
                                          <div style={styles.orderContent}>
                                            
                                              <div style={styles.orderDetails}>
                                                  <p style={styles.detailText}><strong>{t('Customer Name')}:</strong> {order.name}</p>
                                                  <p style={styles.detailText}><strong>{t('Scheduled Pickup')}:</strong> {new Date(order.schedulePickup).toLocaleString()}</p>
                                                  <p style={styles.detailText}><strong>{t('Total Weight')}:</strong> {order.totalWeight} kg</p>
                                                  <p style={styles.detailText}><strong>{t('Cart')}:</strong></p>
                                                  <ul style={styles.cartList}>
                                                      {order.cart.map((item) => (
                                                          <li key={item.itemId} style={styles.cartItem}>
                                                              <img src={item.imageUrl} alt={item.name} style={styles.cartItemImage} />
                                                              <div style={styles.cartItemDetails}>
                                                                  <p style={styles.cartItemText}><strong>{t('Item Name')}:</strong> {item.name}</p>
                                                                  <p style={styles.cartItemText}><strong>{t('Price')}:</strong> ₹ {item.price}</p>
                                                                  <p style={styles.cartItemText}><strong>{t('Quantity')}:</strong> {item.quantity}</p>
                                                              </div>
                                                          </li>
                                                      ))}
                                                  </ul>
                                              </div>
                                          </div>
                                          <div style={styles.actionButtons}>
                                              <button style={styles.acceptButton} onClick={() => handleStartOrder(order)}>{t('Accept')}</button>
                                              <button style={styles.rejectButton}>{t('Reject')}</button>
                                          </div>
                                      </div>
                                  ))
                              ) : (
                                  <div style={styles.orderItem}>
                                      <h2 style={styles.sectionTitle}>
                                      {t('Pending Orders')}</h2>
                                      <p style={styles.noOrdersText}>{t('No pending orders')}</p>
                                  </div>
                              )}


                                  {/* Display orders with status 'inProgress' */}
                                    {currentOrders.filter(order => order.status === 'inProgress').length > 0 ? (
                                      currentOrders.filter(order => order.status === 'inProgress').map((order) => (
                                        <div key={order.id} style={styles.orderItem}>
                                                <h2
                                                  style={styles.sectionTitle}
                                                  onClick={() => toggleOrderContent(order.id)}
                                                >
                                                  {t('InProgress')}
                                                  <span style={styles.toggleIcon}>
                                                    {expandedOrderId === order.id ? '▼' : '▲'}
                                                  </span>
                                                </h2>

                                                <div
                                                  style={styles.orderHeader}
                                                  onClick={() => toggleOrderContent(order.id)}
                                                >
                                                  <h2 style={styles.orderId}>{`Order ID: ${order.id}`}</h2>
                                                  <p style={styles.orderStatus}>{`Status: ${order.status}`}</p>
                                                </div>

                                                <div
                                                  style={{
                                                    ...styles.orderContentWrapper,
                                                    maxHeight: expandedOrderId === order.id ? '1000px' : '0px', // Animate height
                                                  }}
                                                >
                                                  <div style={styles.orderContent}>
                                                    <div style={styles.orderDetails}>
                                                      <p style={styles.detailText}>
                                                        <strong>{t('Customer Name')}:</strong> {order.name}
                                                      </p>
                                                      <p style={styles.detailText}>
                                                        <strong>{t('Scheduled Pickup')}:</strong>{' '}
                                                        {new Date(order.schedulePickup).toLocaleString()}
                                                      </p>
                                                      <p style={styles.detailText}>
                                                        <strong>{t('Total Weight')}:</strong> {order.totalWeight} kg
                                                      </p>
                                                      <p style={styles.detailText}>
                                                        <strong>{t('Cart')}:</strong>
                                                      </p>
                                                      <ul style={styles.cartList}>
                                                        {order.cart.map((item) => (
                                                          <li key={item.itemId} style={styles.cartItem}>
                                                            <img
                                                              src={item.imageUrl}
                                                              alt={item.name}
                                                              style={styles.cartItemImage}
                                                            />
                                                            <div style={styles.cartItemDetails}>
                                                              <p style={styles.cartItemText}>
                                                                <strong>{t('Item Name')}:</strong> {item.name}
                                                              </p>
                                                              <p style={styles.cartItemText}>
                                                                <strong>{t('Price')}:</strong> ₹ {item.price}
                                                              </p>
                                                              <p style={styles.cartItemText}>
                                                                <strong>{t('Quantity')}:</strong> {item.quantity}
                                                              </p>
                                                            </div>
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                  <div style={styles.imagesContainer}>
                                                    {order.images.map((image, index) => (
                                                      <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Scrap Item ${index + 1}`}
                                                        style={styles.orderImage}
                                                      />
                                                    ))}
                                                  </div>
                                                </div>
                                                <div style={styles.actionButtons}>
                                                  <button style={styles.trackButton} onClick={() => trackOrder(order)}>
                                                    {t('Track Order')}
                                                  </button>
                                                  <button
                                                    style={styles.completeButton}
                                                    onClick={() => openModal(order)}
                                                  >
                                                    {t('Complete Order')}
                                                  </button>
                                                </div>
                                              </div>
                                          ))
                                        ) : (
                                          <div style={styles.orderItem}>
                                            <h2 style={styles.sectionTitle}>
                                            {t('InProgress')}</h2>
                                            <p style={styles.noOrdersText}>{t('No in-progress orders')}</p>
                                          </div>
                                        )}

                                    <Modal
                                            isOpen={isModalOpen}
                                            onRequestClose={closeModal}
                                            style={{
                                              overlay: styles.modalOverlay,
                                              content: styles.modalContent,
                                            }}
                                            contentLabel="Complete Order"
                                          >
                                              <div style={styles.modalContentWrapper}>
                                                        <h2>{t('Complete Order')}</h2>
                                                        <ul style={styles.cartList}>
                                                          {selectedOrder && selectedOrder.cart.map((item) => (
                                                            <li key={item.itemId} style={styles.cartItem}>
                                                              <p style={styles.cartItemText}><strong>{t('Item Name')}:</strong> {item.name}</p>
                                                              <input
                                                                type="number"
                                                                value={quantities[item.itemId] || ''}
                                                                onChange={(e) => handleQuantityChange(item.itemId, e.target.value, item.price)}
                                                                style={styles.priceInput}
                                                                placeholder={t('Enter Quantity')}
                                                              />
                                                              <input
                                                                type="number"
                                                                value={paidAmounts[item.itemId] || ''}
                                                                style={styles.priceInput}
                                                                placeholder={t('Enter Paid Amount')}
                                                                readOnly // Make this field read-only since it's auto-calculated
                                                              />
                                                            </li>
                                                          ))}
                                                        </ul>
                                                        <button style={styles.saveButton} onClick={handleConfirmOrder}>
                                                          {t('Confirm Order')}
                                                        </button>
                                                        <button style={styles.cancelButton} onClick={closeModal}>
                                                          {t('Cancel')}
                                                        </button>
                                                      </div>

                                  </Modal>
 

                                {/* Order Details for selected order */}
                          {/* Completed Orders */}
                          {currentOrders.filter(order => order.status === 'completed').length > 0 ? (
                                      currentOrders.filter(order => order.status === 'completed').map((order) => (
                                        <div key={order.id} style={styles.orderItem}>
                                          <div style={styles.orderHeader}>
                                            <h3>{t('Completed Order Details')}</h3>
                                          </div>
                                          <div style={styles.orderContent}>
                                          <div style={styles.orderDetails}>
                                            <p style={styles.detailText}><strong>{t('Customer')}:</strong> {order.name}</p>
                                            <p style={styles.detailText}><strong>{t('Total Weight')}:</strong> {order.totalWeight} kg</p>
                                            <p style={styles.detailText}><strong>{t('Collection Time')}:</strong> {new Date(order.schedulePickup).toLocaleString()}</p>
                                            {order.cart.map((item) => (
                                                  <li key={item.itemId} style={{ display: 'flex', marginBottom: 10 }}>
                                                    <img src={item.imageUrl} alt={item.name} style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }} />
                                                    <div>
                                                      <p style={{ margin: 0, fontSize: 12 }}><strong>{t('Item Name')}:</strong> {item.name}</p>
                                                      <p style={{ margin: '2px 0', fontSize: 12 }}><strong>{t('PaidAmount')}:</strong> ₹ {item.paidAmount}</p>
                                                      <p style={{ margin: 0, fontSize: 12 }}><strong>{t('Quantity')}:</strong> {item.quantity}</p>
                                                    </div>
                                                  </li>
                                                ))}
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                                  {order.images.map((image, index) => (
                                                    <img key={index} src={image} alt={`Scrap Item ${index + 1}`} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                                                  ))}
                                            </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div style={styles.orderItem}>
                                        <h3 style={styles.sectionTitle}>{t('Completed Order Details')}</h3>
                                        <p style={styles.noOrdersText}>{t('No completed orders')}</p>
                        </div>
                    )}
              </div>
        );

        case 'Your Pricings':
                                  return (
                                          <div>
                                                      <h2 style={styles.sectionTitle}>{t('Accepted Materials')}</h2>
                                                      <div style={styles.categoriesContainer}>
                                                        {scrapBuyer.acceptedMaterials && scrapBuyer.acceptedMaterials.length > 0 && (
                                                            scrapBuyer.acceptedMaterials.map((material, index) => (
                                                              <div
                                                                key={index}
                                                                style={{
                                                                  ...styles.categoryTile,
                                                                  ...(selectedCategory === material.category ? styles.categoryTileActive : {}),
                                                                }}
                                                                onClick={() => handleCategoryClick(material.category)}
                                                              >
                                                                {material.category}
                                                              </div>
                                                            ))
                                                          )}
                                                      </div>
                                                      <div style={styles.pricingContainer}>
                                                        {filteredMaterials && filteredMaterials.length > 0 ? (
                                                          filteredMaterials.map((material, index) => (
                                                            <div key={index} style={styles.materialCard}>
                                                              <h3 style={styles.materialCategory}>{material.category}</h3>
                                                              <div style={styles.itemsGrid}>
                                                                {material.items.map((item) => (
                                                                  <div key={item.itemId} style={styles.itemCard}>
                                                                    <img src={item.imageUrl} alt={item.name} style={styles.itemImage} />
                                                                    <p style={styles.itemName}><strong>{t('Item Name')}:</strong> {item.name}</p>
                                                                    {editingItem === item.itemId ? (
                                                                      <div style={styles.editContainer}>
                                                                        <input
                                                                          type="number"
                                                                          value={editedPrice}
                                                                          onChange={(e) => setEditedPrice(e.target.value)}
                                                                          style={styles.priceInput}
                                                                        />
                                                                        <button style={styles.saveButton} onClick={() => handleSaveClick(item)}>
                                                                          {t('Save')}
                                                                        </button>
                                                                      </div>
                                                                    ) : (
                                                                      <p style={styles.itemPrice}>
                                                                        <strong>{t('Buyer Price')}:</strong> ₹ {item.buyerPrice.toFixed(2)} / kg
                                                                        <button style={styles.editButton} onClick={() => handleEditClick(item)}>
                                                                          {t('Edit')}
                                                                        </button>
                                                                      </p>
                                                                    )}
                                                                  </div>
                                                                ))}
                                                              </div>
                                                            </div>
                                                          ))
                                                        ) : (
                                                          <p style={styles.noMaterialsText}>{t('No accepted materials available.')}</p>
                                                        )}
                                                      </div>
                                                    </div>
                                                  );


      case 'Payments':
        return (
                    <div style={styles.walletContainer}>
                            <div style={styles.walletSection}>
                              <h3 style={styles.sectionHeader}>{t('Recharge Wallet')}</h3>
                              <input
                                type="number"
                                value={rechargeAmount}
                                onChange={(e) => setRechargeAmount(e.target.value)}
                                style={styles.rechargeInput}
                                placeholder={t('Enter Amount')}
                              />
                              <button style={styles.rechargeButton} onClick={handleAddFunds}>
                                {t('Add Funds')}
                              </button>
                            </div>

                            <div style={styles.walletSection}>
                              <h3 style={styles.sectionHeader}>{t('Transaction History')}</h3>
                              {scrapBuyer.wallet.transactions.length > 0 ? (
                                <ul style={styles.transactionList}>
                                  {scrapBuyer.wallet.transactions.map((transaction) => (
                                    <li key={transaction.transactionId} style={styles.transactionItem}>
                                      <p style={styles.transactionText}>
                                        <strong>{t('Date')}:</strong> {new Date(transaction.date).toLocaleString()}
                                      </p>
                                      <p style={styles.transactionText}>
                                        <strong>{t('Amount')}:</strong> ₹ {transaction.amount.toFixed(2)}
                                      </p>
                                      <p style={styles.transactionText}>
                                        <strong>{t('Type')}:</strong> {transaction.type}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p style={styles.noTransactionsText}>{t('No transactions available')}</p>
                              )}
                            </div>

                            <div style={styles.walletSection}>
                              <h3 style={styles.sectionHeader}>{t('Invoice Generation')}</h3>
                              <button style={styles.generateInvoiceButton}>{t('Generate Invoice')}</button>
                            </div>
                          </div>

        );
        case 'Sell Your Recyclables':
          return <SellYourRecyclables styles={styles} t={t} />;


          case 'Analytics & Reports':
        return <AnalyticsAndReports styles={styles} t={t} />;

      case 'Support & Help Center':
        return (
          <div>
              <div>
              <h3>{t('Customer Feedback')}</h3>
                <div style={styles.orderList}>
                  <h3>{t('Help Section')}</h3>
                  <p>{t('FAQs and guidelines go here.')}</p>
                </div>
                <div style={styles.orderList}>
                  <h3>{t('Contact Support')}</h3>
                  <button style={styles.button}>{t('Chat with Us')}</button>
                  <button style={styles.button}>{t('Call Us')}</button>
                  <button style={styles.button}>{t('Email Us')}</button>
                </div>
                <div style={styles.orderList}>
                  <h3>{t('Ticketing System')}</h3>
                  <p>{t('No open tickets')}</p>
                </div>
              </div>
            <div style={styles.orderList}>
              <h3>{t('Feedback Form')}</h3>
              <p>{t('Customers can rate their experience.')}</p>
            </div>
            <div style={styles.orderList}>
              <h3>{t('Rating Display')}</h3>
              <p>{t('Average Rating: 4.5')}</p>
            </div>
            <div style={styles.orderList}>
              <h3>{t('Respond to Feedback')}</h3>
              <button style={styles.button}>{t('Reply to Customer')}</button>
            </div>
          </div>
        );
      default:
        return <div>{t('Select an option from the sidebar.')}</div>;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img
          src={ListIcon}
          alt="Menu"
          style={styles.languageIcon}
          onClick={() => setShowSidebar(true)}
        />
        <div style={styles.logo}>{t('Recyclables Buyer')}</div>
        <img
          src={LanguageIcon}
          alt="Language"
          style={styles.languageIcon}
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownItem} onClick={() => handleLanguageChange('en')}>English</div>
            <div style={styles.dropdownItem} onClick={() => handleLanguageChange('te')}>తెలుగు</div>
            <div style={styles.dropdownItem} onClick={() => handleLanguageChange('hi')}>हिंदी</div>
            <div style={styles.dropdownItem} onClick={() => handleLanguageChange('ta')}>தமிழ்</div>
            <div style={styles.dropdownItem} onClick={() => handleLanguageChange('kn')}>ಕನ್ನಡ</div>
          </div>
        )}
      </div>

      <div style={styles.contentSection}>
        {renderContentSection()}
      </div>

      <div style={styles.sidebar}>
        <img
          src={DoubleArrowIcon}
          alt="Close"
          style={styles.closeIcon}
          onClick={() => setShowSidebar(false)}
        />
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Dashboard' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => {
            setActiveSection('Dashboard');
            setShowSidebar(false);
          }}
        >
          {t('Dashboard')}
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Order Management' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => {setActiveSection('Order Management'); setShowSidebar(false);}}
        >
          {t('Order Management')}
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Sell Your Recyclables' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => {setActiveSection('Sell Your Recyclables'); setShowSidebar(false);}}
        >
          {t('Sell Your Recyclables')}
        </div>
        <div
              style={{
                ...styles.sidebarItem,
                ...(activeSection === 'Your Pricings' ? styles.sidebarItemActive : {}),
              }}
              onClick={() => {setActiveSection('Your Pricings'); setShowSidebar(false);}}
            >
              {t('Your Pricings')}
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Payments' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => {setActiveSection('Payments'); setShowSidebar(false);}}
        >
          {t('Payments')}
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Analytics & Reports' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => {setActiveSection('Analytics & Reports'); setShowSidebar(false);}}
        >
          {t('Analytics & Reports')}
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Settings' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => {setActiveSection('Settings'); setShowSidebar(false);}}
        >
          {t('Settings')}
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Support & Help Center' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => {setActiveSection('Support & Help Center'); setShowSidebar(false);}}
        >
          {t('Support & Help Center')}
        </div>
        
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeSection === 'Logout' ? styles.sidebarItemActive : {}),
          }}
          onClick={() => setActiveSection('Logout')}
        >
          {t('Logout')}
        </div>
      </div>
    </div>
  );
};

export default ScrapBuyerDashboard;
