import React, { useState, useMemo } from 'react';
import {
  Button,
  Tag,
  Input,
  InputNumber,
  Select,
  Modal,
  Radio,
  Divider,
  message,
  Tooltip,
} from 'antd';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Printer,
  CheckCircle,
  CreditCard,
  IndianRupee,
  Barcode,
  User,
  Search,
  RotateCcw,
  QrCode,
  Banknote,
  PauseCircle,
  PlayCircle,
  Download,
  Share2,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';
import dayjs from 'dayjs';

const BRAND_PURPLE = '#441A87';

export interface PosProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  stock: number;
  gstRate: number;
  unit: string;
}

export interface PosCartItem extends PosProduct {
  qty: number;
  itemDiscountPercent: number;
}

export interface HeldBill {
  id: string;
  heldAt: string;
  customerType: 'WALK_IN' | 'EXISTING';
  customerName: string;
  customerPhone: string;
  items: PosCartItem[];
  cartDiscount: number;
  total: number;
}

const POS_CATALOG: PosProduct[] = [
  {
    id: 'p-1',
    name: 'Industrial Heavy Duty V-Belt B-68',
    sku: 'BLT-VB-68',
    barcode: '890102030401',
    category: 'Belts & Drives',
    price: 450,
    stock: 84,
    gstRate: 18,
    unit: 'Pcs',
  },
  {
    id: 'p-2',
    name: 'Deep Groove Ball Bearing 6205-2RS C3',
    sku: 'BRG-6205-2RS',
    barcode: '890102030402',
    category: 'Bearings',
    price: 620,
    stock: 120,
    gstRate: 18,
    unit: 'Pcs',
  },
  {
    id: 'p-3',
    name: 'High-Temp Hydraulic Seal Ring Kit 40mm',
    sku: 'SEAL-HYD-40',
    barcode: '890102030403',
    category: 'Hydraulics',
    price: 850,
    stock: 45,
    gstRate: 18,
    unit: 'Kit',
  },
  {
    id: 'p-4',
    name: 'Synthetic Industrial Gear Oil ISO 46 (5L)',
    sku: 'OIL-ROT-46-5L',
    barcode: '890102030404',
    category: 'Lubricants',
    price: 2400,
    stock: 32,
    gstRate: 18,
    unit: 'Can',
  },
  {
    id: 'p-5',
    name: 'Pneumatic Directional Solenoid Valve 24V DC',
    sku: 'PNU-SOL-24V',
    barcode: '890102030405',
    category: 'Pneumatics',
    price: 1850,
    stock: 28,
    gstRate: 18,
    unit: 'Pcs',
  },
  {
    id: 'p-6',
    name: 'Proximity Sensor Inductive M12 Shielded',
    sku: 'SNS-IND-M12',
    barcode: '890102030406',
    category: 'Electrical & Sensors',
    price: 1200,
    stock: 60,
    gstRate: 18,
    unit: 'Pcs',
  },
  {
    id: 'p-7',
    name: 'Digital Pressure Gauge 0-250 Bar G1/4',
    sku: 'GAU-DIG-250B',
    barcode: '890102030407',
    category: 'Hydraulics',
    price: 3400,
    stock: 18,
    gstRate: 18,
    unit: 'Pcs',
  },
  {
    id: 'p-8',
    name: 'Flange Mounted Pillow Block Bearing UCP205',
    sku: 'BRG-UCP-205',
    barcode: '890102030408',
    category: 'Bearings',
    price: 940,
    stock: 52,
    gstRate: 18,
    unit: 'Pcs',
  },
  {
    id: 'p-9',
    name: 'Single Phase AC Motor Starter 1.5kW 230V',
    sku: 'ELE-STR-1.5K',
    barcode: '890102030409',
    category: 'Electrical & Sensors',
    price: 1650,
    stock: 24,
    gstRate: 18,
    unit: 'Unit',
  },
];

const CATEGORIES = ['All Categories', 'Belts & Drives', 'Bearings', 'Hydraulics', 'Lubricants', 'Pneumatics', 'Electrical & Sensors'];

export const PosSalesPage: React.FC = () => {
  // Cashier Session & Shift State
  const [shiftStatus, setShiftStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [cashierName] = useState('Karthik Raja');
  const [counterNumber] = useState('Register #02');
  const [openingFloatCash] = useState<number>(5000);
  const [cashSalesTotal, setCashSalesTotal] = useState<number>(24500);
  const [upiSalesTotal, setUpiSalesTotal] = useState<number>(42800);
  const [cardSalesTotal, setCardSalesTotal] = useState<number>(17220);
  const [cashInOutNet, setCashInOutNet] = useState<number>(0);
  const [todayReceiptsCount, setTodayReceiptsCount] = useState<number>(38);

  // Computed today sales
  const todaySalesTotal = useMemo(() => {
    return cashSalesTotal + upiSalesTotal + cardSalesTotal;
  }, [cashSalesTotal, upiSalesTotal, cardSalesTotal]);

  // Expected Cash in Drawer
  const expectedDrawerCash = useMemo(() => {
    return openingFloatCash + cashSalesTotal + cashInOutNet;
  }, [openingFloatCash, cashSalesTotal, cashInOutNet]);

  // Shift & Cash Modal States
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
  const [actualDrawerCashInput, setActualDrawerCashInput] = useState<number>(expectedDrawerCash);
  const [isCashInOutModalOpen, setIsCashInOutModalOpen] = useState(false);
  const [cashInOutType, setCashInOutType] = useState<'IN' | 'OUT'>('IN');
  const [cashInOutAmount, setCashInOutAmount] = useState<number>(1000);
  const [cashInOutReason, setCashInOutReason] = useState('Float replenishment');

  // Product Selection & Filter States (Left ~60%)
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Active Cart State (Right ~40%)
  const [customerType, setCustomerType] = useState<'WALK_IN' | 'EXISTING'>('WALK_IN');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('+91 98401 55210');
  const [cart, setCart] = useState<PosCartItem[]>([
    { ...POS_CATALOG[0], qty: 2, itemDiscountPercent: 0 },
    { ...POS_CATALOG[1], qty: 1, itemDiscountPercent: 5 },
  ]);
  const [cartDiscountPercent, setCartDiscountPercent] = useState<number>(0);
  const [isInterState, setIsInterState] = useState<boolean>(false);

  // Held Bills State
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [isHeldBillsModalOpen, setIsHeldBillsModalOpen] = useState(false);

  // Payment Settlement States
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD' | 'SPLIT'>('UPI');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [splitCashAmount, setSplitCashAmount] = useState<number>(0);
  const [splitUpiAmount, setSplitUpiAmount] = useState<number>(0);
  const [transactionRef, setTransactionRef] = useState('');

  // Invoice / Receipt Modal
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return POS_CATALOG.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.includes(searchQuery);

      const matchCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Total Item & Unit Count
  const totalItemCount = cart.length;
  const totalUnitsCount = useMemo(() => cart.reduce((acc, it) => acc + (it.qty || 0), 0), [cart]);

  // Billing Calculations
  const calculations = useMemo(() => {
    let subtotal = 0;
    let itemDiscountTotal = 0;
    let taxableAmount = 0;
    let totalTax = 0;

    cart.forEach((item) => {
      const lineGross = item.price * item.qty;
      const lineDisc = lineGross * (item.itemDiscountPercent / 100);
      const lineTaxable = lineGross - lineDisc;
      const lineGst = lineTaxable * (item.gstRate / 100);

      subtotal += lineGross;
      itemDiscountTotal += lineDisc;
      taxableAmount += lineTaxable;
      totalTax += lineGst;
    });

    const cartDiscountAmt = taxableAmount * (cartDiscountPercent / 100);
    const finalTaxable = Math.max(0, taxableAmount - cartDiscountAmt);
    const finalGst = totalTax * (1 - cartDiscountPercent / 100);

    const cgst = isInterState ? 0 : finalGst / 2;
    const sgst = isInterState ? 0 : finalGst / 2;
    const igst = isInterState ? finalGst : 0;

    const rawTotal = finalTaxable + finalGst;
    const grandTotal = Math.round(rawTotal);
    const roundOff = Number((grandTotal - rawTotal).toFixed(2));

    return {
      subtotal: Math.round(subtotal),
      itemDiscountTotal: Math.round(itemDiscountTotal),
      cartDiscountAmt: Math.round(cartDiscountAmt),
      taxableAmount: Math.round(finalTaxable),
      cgst: Math.round(cgst),
      sgst: Math.round(sgst),
      igst: Math.round(igst),
      totalGst: Math.round(finalGst),
      grandTotal,
      roundOff,
    };
  }, [cart, cartDiscountPercent, isInterState]);

  // Change to return
  const changeToReturn = useMemo(() => {
    if (paymentMethod === 'CASH') {
      const rec = amountReceived || 0;
      return Math.max(0, rec - calculations.grandTotal);
    }
    return 0;
  }, [paymentMethod, amountReceived, calculations.grandTotal]);

  // Barcode Scan Handler - Fast Barcode Reader & Auto Cart Increments
  const handleBarcodeScan = () => {
    if (!barcodeInput) return;
    const cleanQuery = barcodeInput.trim().toLowerCase();
    const match = POS_CATALOG.find(
      (p) =>
        p.barcode.toLowerCase() === cleanQuery ||
        p.sku.toLowerCase() === cleanQuery ||
        p.name.toLowerCase().includes(cleanQuery)
    );
    if (match) {
      handleAddToCart(match);
      setBarcodeInput('');
    } else {
      message.error(`Product not found for SKU / Barcode: "${barcodeInput}"`);
    }
  };

  const handleBarcodeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBarcodeScan();
    }
  };

  const handleAddToCart = (product: PosProduct) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].qty + 1;
        if (newQty > product.stock) {
          message.warning(`Maximum available stock reached (${product.stock} units).`);
          return prevCart;
        }
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: newQty,
        };
        message.success(`Updated "${product.name}" quantity to ${newQty}`);
        return updated;
      } else {
        message.success(`Added "${product.name}" to cart`);
        return [{ ...product, qty: 1, itemDiscountPercent: 0 }, ...prevCart];
      }
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, qty } : item)));
    }
  };

  const updateItemDiscount = (id: string, disc: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, itemDiscountPercent: Math.min(100, Math.max(0, disc)) } : item)));
  };

  // Hold / Resume Bill
  const handleHoldBill = () => {
    if (cart.length === 0) {
      message.warning('Cart is empty. Nothing to hold.');
      return;
    }
    const newHold: HeldBill = {
      id: `HB-${Date.now().toString().slice(-4)}`,
      heldAt: dayjs().format('hh:mm A'),
      customerType,
      customerName,
      customerPhone,
      items: [...cart],
      cartDiscount: cartDiscountPercent,
      total: calculations.grandTotal,
    };
    setHeldBills([newHold, ...heldBills]);
    setCart([]);
    message.info(`Bill #${newHold.id} put on hold.`);
  };

  const handleResumeBill = (held: HeldBill) => {
    setCart(held.items);
    setCustomerType(held.customerType);
    setCustomerName(held.customerName);
    setCustomerPhone(held.customerPhone);
    setCartDiscountPercent(held.cartDiscount);
    setHeldBills(heldBills.filter((h) => h.id !== held.id));
    setIsHeldBillsModalOpen(false);
    message.success(`Resumed bill #${held.id}`);
  };

  // Complete Payment Action
  const handleCompletePayment = () => {
    if (cart.length === 0) {
      message.warning('Cannot complete checkout with empty cart.');
      return;
    }

    if (shiftStatus === 'CLOSED') {
      message.error('Shift is CLOSED. Open register shift first.');
      return;
    }

    const nextInvNo = `POS-${dayjs().format('YYYYMMDD')}-${String(todayReceiptsCount + 1).padStart(4, '0')}`;
    const invoiceRecord = {
      invoiceNumber: nextInvNo,
      date: dayjs().format('YYYY-MM-DD hh:mm A'),
      cashier: cashierName,
      counter: counterNumber,
      customerType,
      customerName,
      customerPhone,
      items: [...cart],
      calculations: { ...calculations },
      paymentMethod,
      amountReceived: paymentMethod === 'CASH' ? amountReceived || calculations.grandTotal : calculations.grandTotal,
      changeToReturn,
      transactionRef: transactionRef || (paymentMethod === 'UPI' ? 'UPI-AUTO-CLEAR' : paymentMethod === 'CARD' ? 'CARD-TXN-APPR' : 'CASH-REC'),
    };

    setGeneratedInvoice(invoiceRecord);
    setIsReceiptModalOpen(true);

    // Update shift collection bucket
    if (paymentMethod === 'CASH') setCashSalesTotal((prev) => prev + calculations.grandTotal);
    else if (paymentMethod === 'UPI') setUpiSalesTotal((prev) => prev + calculations.grandTotal);
    else if (paymentMethod === 'CARD') setCardSalesTotal((prev) => prev + calculations.grandTotal);
    else if (paymentMethod === 'SPLIT') {
      setCashSalesTotal((prev) => prev + (splitCashAmount || 0));
      setUpiSalesTotal((prev) => prev + (splitUpiAmount || 0));
    }

    setTodayReceiptsCount((prev) => prev + 1);

    // Reset Cart
    setCart([]);
    setCartDiscountPercent(0);
    setAmountReceived(0);
    setSplitCashAmount(0);
    setSplitUpiAmount(0);
    setTransactionRef('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {/* 1. POS Header & Shift Management Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '14px 20px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Terminal Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: BRAND_PURPLE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(68, 26, 135, 0.2)',
            }}
          >
            <ShoppingCart size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
                POS & Counter Sales Terminal
              </span>
              <Tag
                style={{
                  background: shiftStatus === 'OPEN' ? '#F0FDF4' : '#FEF2F2',
                  color: shiftStatus === 'OPEN' ? '#15803D' : '#B91C1C',
                  border: `1px solid ${shiftStatus === 'OPEN' ? '#BBF7D0' : '#FECACA'}`,
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: 11,
                  margin: 0,
                }}
              >
                Shift {shiftStatus}
              </Tag>
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <span>Cashier: <strong style={{ color: '#1F2937' }}>{cashierName}</strong></span>
              <span>&bull;</span>
              <span>{counterNumber}</span>
              <span>&bull;</span>
              <span>Opening Float: <strong>₹{openingFloatCash.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>
        </div>

        {/* Shift Controls & Sales Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* 2 Compact Summary Cards */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #FAF5FF 0%, #F5EEFD 100%)',
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid #E9D5FF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, color: BRAND_PURPLE, textTransform: 'uppercase' }}>
                Today's Sales
              </span>
              <span style={{ fontSize: 16, fontWeight: 900, color: BRAND_PURPLE }}>
                ₹{todaySalesTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid #BBF7D0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
                Receipts Issued
              </span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#15803D' }}>
                {todayReceiptsCount} Bills
              </span>
            </div>
          </div>

          <div style={{ width: 1, height: 32, background: '#E5E7EB' }} />

          {/* Quick Shift Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              onClick={() => setIsCashInOutModalOpen(true)}
              style={{ height: 36, borderRadius: 8, fontSize: 12, fontWeight: 600 }}
            >
              Cash In / Out
            </Button>

            <Button
              type={shiftStatus === 'OPEN' ? 'default' : 'primary'}
              danger={shiftStatus === 'OPEN'}
              onClick={() => {
                setActualDrawerCashInput(expectedDrawerCash);
                setIsCloseShiftModalOpen(true);
              }}
              style={{ height: 36, borderRadius: 8, fontWeight: 700, fontSize: 12 }}
            >
              {shiftStatus === 'OPEN' ? 'Close Shift' : 'Open Shift'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main POS Workspace: Two-Column Desktop Workspace (Left 60%, Right 40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(600px, 1.45fr) minmax(380px, 1fr)', gap: 16, alignItems: 'start' }}>
        {/* LEFT SECTION (60%): Product Selection Workspace */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: 16,
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Barcode Scanner & Search Input Toolbar */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px' }}>
              <Input
                prefix={<Barcode size={16} color={BRAND_PURPLE} />}
                placeholder="Scan Barcode or Enter SKU (Press Enter to Add)"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeInputKeyDown}
                onPressEnter={handleBarcodeScan}
                style={{ height: 40, borderRadius: 8, fontSize: 13, borderColor: '#CBD5E1' }}
              />
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <Input
                prefix={<Search size={15} color="#94A3B8" />}
                placeholder="Search Product Name or Model"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{ height: 40, borderRadius: 8, fontSize: 13, borderColor: '#CBD5E1' }}
              />
            </div>

            <Button
              type="primary"
              onClick={handleBarcodeScan}
              style={{
                height: 40,
                borderRadius: 8,
                backgroundColor: BRAND_PURPLE,
                borderColor: BRAND_PURPLE,
                fontWeight: 700,
                fontSize: 13,
                padding: '0 18px',
              }}
            >
              Scan
            </Button>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    border: isSelected ? `1.5px solid ${BRAND_PURPLE}` : '1px solid #E5E7EB',
                    backgroundColor: isSelected ? BRAND_PURPLE : '#F9FAFB',
                    color: isSelected ? '#FFFFFF' : '#4B5563',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid with Proper Height and Breathing Room */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 14,
              maxHeight: 620,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {filteredProducts.map((p) => {
              const inCart = cart.find((i) => i.id === p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  style={{
                    background: inCart ? '#FAF5FF' : '#FFFFFF',
                    border: inCart ? '1.5px solid #A855F7' : '1px solid #E5E7EB',
                    borderRadius: 12,
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 180,
                    boxShadow: inCart ? '0 4px 14px rgba(112, 26, 117, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!inCart) {
                      e.currentTarget.style.borderColor = BRAND_PURPLE;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(68, 26, 135, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!inCart) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                >
                  <div>
                    {/* Top: Available Stock & Category */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {p.category}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: p.stock > 20 ? '#F0FDF4' : '#FEF2F2',
                          color: p.stock > 20 ? '#15803D' : '#B91C1C',
                          border: `1px solid ${p.stock > 20 ? '#BBF7D0' : '#FECACA'}`,
                        }}
                      >
                        {p.stock} in stock
                      </span>
                    </div>

                    {/* Product Name */}
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 13.5,
                        color: '#111827',
                        lineHeight: 1.4,
                        minHeight: 38,
                        marginTop: 4,
                      }}
                    >
                      {p.name}
                    </div>

                    {/* SKU & GST Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 11,
                          fontWeight: 600,
                          background: '#F3F4F6',
                          color: '#4B5563',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {p.sku}
                      </span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>&bull;</span>
                      <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>GST {p.gstRate}%</span>
                    </div>
                  </div>

                  {/* Bottom: Selling Price & Add Button */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      marginTop: 14,
                      paddingTop: 10,
                      borderTop: '1px solid #F3F4F6',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Price</div>
                      <div style={{ fontWeight: 900, color: BRAND_PURPLE, fontSize: 17, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        padding: '6px 14px',
                        background: BRAND_PURPLE,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(68, 26, 135, 0.25)',
                      }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION (40%): Current Cart, Billing Summary & Checkout */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: 18,
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            position: 'sticky',
            top: 16,
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {/* Cart Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>Current Cart</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#FAF5FF', color: BRAND_PURPLE, padding: '2px 8px', borderRadius: 10, border: '1px solid #E9D5FF' }}>
                {totalItemCount} Products ({totalUnitsCount} Units)
              </span>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <Button
                size="small"
                icon={<PauseCircle size={13} />}
                onClick={handleHoldBill}
                style={{ fontSize: 11, height: 28, borderRadius: 6, color: '#B45309', borderColor: '#FDE68A', background: '#FFFBEB' }}
              >
                Hold Bill
              </Button>

              {heldBills.length > 0 && (
                <Button
                  size="small"
                  icon={<PlayCircle size={13} />}
                  onClick={() => setIsHeldBillsModalOpen(true)}
                  style={{ fontSize: 11, height: 28, borderRadius: 6, color: '#1D4ED8', borderColor: '#BFDBFE', background: '#EFF6FF' }}
                >
                  Resume ({heldBills.length})
                </Button>
              )}

              <Button
                size="small"
                icon={<RotateCcw size={13} />}
                onClick={() => {
                  setCart([]);
                  message.info('Cart cleared');
                }}
                danger
                style={{ fontSize: 11, height: 28, borderRadius: 6 }}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Customer Selection Row */}
          <div style={{ background: '#F9FAFB', padding: 12, borderRadius: 10, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Radio.Group
                size="small"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
              >
                <Radio value="WALK_IN">Walk-in Customer</Radio>
                <Radio value="EXISTING">Registered B2B Customer</Radio>
              </Radio.Group>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span>Inter-State (IGST):</span>
                <input
                  type="checkbox"
                  checked={isInterState}
                  onChange={(e) => setIsInterState(e.target.checked)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
              <div>
                <span style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 600 }}>Customer Name</span>
                <Input
                  size="small"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  style={{ borderRadius: 6, marginTop: 2, height: 30 }}
                />
              </div>
              <div>
                <span style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 600 }}>Mobile Number (SMS Bill)</span>
                <Input
                  size="small"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91..."
                  style={{ borderRadius: 6, marginTop: 2, height: 30 }}
                />
              </div>
            </div>
          </div>

          {/* Cart Line Items List */}
          <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #F1F5F9', borderRadius: 8, padding: '4px 6px', background: '#FAFAFA' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '30px 10px', fontSize: 12.5 }}>
                <ShoppingCart size={26} style={{ margin: '0 auto 6px', opacity: 0.4 }} />
                Cart is empty. Tap products on the left or scan barcode.
              </div>
            ) : (
              cart.map((item) => {
                const lineTotal = Math.round(item.price * item.qty * (1 - item.itemDiscountPercent / 100));
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderBottom: '1px solid #F3F4F6',
                      fontSize: 12,
                      background: '#FFFFFF',
                      borderRadius: 6,
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                      <div style={{ fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 1 }}>
                        ₹{item.price} &bull; GST {item.gstRate}%
                      </div>
                    </div>

                    {/* Quantity, Item Discount & Line Total */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <InputNumber
                        size="small"
                        min={1}
                        value={item.qty}
                        onChange={(v) => updateQuantity(item.id, Number(v))}
                        style={{ width: 48, borderRadius: 4 }}
                      />
                      <Tooltip title="Item Discount %">
                        <InputNumber
                          size="small"
                          min={0}
                          max={100}
                          value={item.itemDiscountPercent}
                          onChange={(v) => updateItemDiscount(item.id, Number(v))}
                          formatter={(val) => `${val}%`}
                          parser={(val: any) => val.replace('%', '')}
                          style={{ width: 52, borderRadius: 4, fontSize: 10 }}
                        />
                      </Tooltip>
                      <span style={{ fontWeight: 800, color: '#111827', minWidth: 65, textAlign: 'right', fontSize: 12.5 }}>
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 0)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px 4px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Billing Summary Box */}
          <div
            style={{
              background: '#F9FAFB',
              borderRadius: 10,
              padding: '12px 14px',
              border: '1px solid #E5E7EB',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 14px', fontSize: 11.5, color: '#4B5563' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{calculations.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Item Discount:</span>
                <span style={{ fontWeight: 600, color: '#16A34A' }}>-₹{calculations.itemDiscountTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Cart Discount %:</span>
                <InputNumber
                  size="small"
                  min={0}
                  max={50}
                  value={cartDiscountPercent}
                  onChange={(v) => setCartDiscountPercent(Number(v) || 0)}
                  style={{ width: 55, height: 22, fontSize: 11 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Taxable Amount:</span>
                <span style={{ fontWeight: 600 }}>₹{calculations.taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              {isInterState ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: 'span 2' }}>
                  <span>IGST (18%):</span>
                  <span style={{ fontWeight: 600 }}>₹{calculations.igst.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CGST (9%):</span>
                    <span style={{ fontWeight: 600 }}>₹{calculations.cgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>SGST (9%):</span>
                    <span style={{ fontWeight: 600 }}>₹{calculations.sgst.toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: 'span 2', borderTop: '1px dashed #E2E8F0', paddingTop: 4 }}>
                <span>Round-off Amount:</span>
                <span style={{ fontWeight: 500, color: '#6B7280' }}>₹{calculations.roundOff}</span>
              </div>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            {/* Grand Total Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                  Grand Total
                </span>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>
                  {isInterState ? 'Inclusive of IGST' : 'Inclusive of CGST + SGST'}
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: BRAND_PURPLE, letterSpacing: '-0.02em' }}>
                ₹{calculations.grandTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Payment Method Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { key: 'UPI', label: 'UPI / QR', icon: <QrCode size={13} /> },
                { key: 'CASH', label: 'Cash', icon: <Banknote size={13} /> },
                { key: 'CARD', label: 'Card', icon: <CreditCard size={13} /> },
                { key: 'SPLIT', label: 'Split', icon: <DollarSign size={13} /> },
              ].map((m) => {
                const isSelected = paymentMethod === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setPaymentMethod(m.key as any)}
                    style={{
                      padding: '8px 6px',
                      borderRadius: 6,
                      border: isSelected ? `2px solid ${BRAND_PURPLE}` : '1px solid #E5E7EB',
                      backgroundColor: isSelected ? '#FAF5FF' : '#FFFFFF',
                      color: isSelected ? BRAND_PURPLE : '#374151',
                      fontWeight: 700,
                      fontSize: 11.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {m.icon} {m.label}
                  </button>
                );
              })}
            </div>

            {/* Cash Input & Change to Return */}
            {paymentMethod === 'CASH' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: '#FFFBEB', padding: 10, borderRadius: 8, border: '1px solid #FDE68A' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#B45309' }}>Amount Received:</span>
                  <InputNumber
                    size="small"
                    min={0}
                    value={amountReceived}
                    onChange={(v) => setAmountReceived(Number(v) || 0)}
                    prefix="₹"
                    style={{ width: '100%', marginTop: 2, height: 28 }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#B45309' }}>Change to Return:</span>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#B45309', marginTop: 4 }}>
                    ₹{changeToReturn.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}

            {/* Reference ID for Digital Payments */}
            {(paymentMethod === 'UPI' || paymentMethod === 'CARD') && (
              <Input
                size="small"
                placeholder="Transaction Approval / RRN Reference ID (Optional)"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                style={{ height: 30, borderRadius: 6, fontSize: 11.5 }}
              />
            )}

            {/* Split Mode Inputs */}
            {paymentMethod === 'SPLIT' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <InputNumber
                  size="small"
                  placeholder="Cash Portion (₹)"
                  value={splitCashAmount}
                  onChange={(v) => setSplitCashAmount(Number(v) || 0)}
                  style={{ width: '100%' }}
                />
                <InputNumber
                  size="small"
                  placeholder="UPI/Card Portion (₹)"
                  value={splitUpiAmount}
                  onChange={(v) => setSplitUpiAmount(Number(v) || 0)}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {/* Complete Payment Button */}
            <Button
              type="primary"
              size="large"
              icon={<CheckCircle size={18} />}
              onClick={handleCompletePayment}
              disabled={cart.length === 0}
              style={{
                height: 46,
                borderRadius: 10,
                backgroundColor: BRAND_PURPLE,
                borderColor: BRAND_PURPLE,
                fontWeight: 800,
                fontSize: 14,
                boxShadow: '0 4px 14px rgba(68, 26, 135, 0.25)',
                marginTop: 4,
              }}
            >
              Complete Payment &bull; ₹{calculations.grandTotal.toLocaleString('en-IN')}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Invoice & Receipt Actions Modal */}
      <Modal
        open={isReceiptModalOpen}
        onCancel={() => setIsReceiptModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsReceiptModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="share"
            icon={<Share2 size={14} />}
            onClick={() => message.success(`SMS / WhatsApp receipt sent to ${generatedInvoice?.customerPhone}`)}
          >
            SMS / WhatsApp Bill
          </Button>,
          <Button
            key="download"
            icon={<Download size={14} />}
            onClick={() => message.info(`Downloading PDF invoice for ${generatedInvoice?.invoiceNumber}`)}
          >
            Download PDF
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<Printer size={15} />}
            onClick={() => {
              window.print();
              setIsReceiptModalOpen(false);
            }}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
          >
            Print Thermal Receipt
          </Button>,
        ]}
        width={500}
      >
        {generatedInvoice && (
          <div style={{ padding: '8px 12px', background: '#FFFFFF', color: '#111827', fontFamily: 'monospace' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #9CA3AF', paddingBottom: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: BRAND_PURPLE }}>ENTERPRISE ERP RETAIL</div>
              <div style={{ fontSize: 11, color: '#4B5563' }}>GSTIN: 33AAAAA0000A1Z5 &bull; Anna Salai, Chennai</div>
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: 12 }}>TAX INVOICE / CASH MEMO</div>
            </div>

            <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span>Invoice: <strong>{generatedInvoice.invoiceNumber}</strong></span>
              <span>{generatedInvoice.date}</span>
            </div>
            <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Register: {generatedInvoice.counter}</span>
              <span>Cust: {generatedInvoice.customerName}</span>
            </div>

            <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse', borderTop: '1px dashed #9CA3AF', borderBottom: '1px dashed #9CA3AF', margin: '6px 0' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#4B5563' }}>
                  <th style={{ padding: '4px 0' }}>Item</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Rate</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {generatedInvoice.items.map((it: PosCartItem) => (
                  <tr key={it.id}>
                    <td style={{ padding: '3px 0' }}>{it.name.slice(0, 22)}</td>
                    <td style={{ textAlign: 'center' }}>{it.qty}</td>
                    <td style={{ textAlign: 'right' }}>₹{it.price}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      ₹{Math.round(it.price * it.qty * (1 - it.itemDiscountPercent / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
              <div>Subtotal: ₹{generatedInvoice.calculations.subtotal}</div>
              <div>Discount: -₹{generatedInvoice.calculations.itemDiscountTotal + generatedInvoice.calculations.cartDiscountAmt}</div>
              <div>Taxable: ₹{generatedInvoice.calculations.taxableAmount}</div>
              {isInterState ? (
                <div>IGST (18%): ₹{generatedInvoice.calculations.igst}</div>
              ) : (
                <>
                  <div>CGST (9%): ₹{generatedInvoice.calculations.cgst}</div>
                  <div>SGST (9%): ₹{generatedInvoice.calculations.sgst}</div>
                </>
              )}
              <div style={{ fontSize: 15, fontWeight: 900, color: BRAND_PURPLE, marginTop: 4, paddingTop: 4, borderTop: '1px solid #111827' }}>
                GRAND TOTAL: ₹{generatedInvoice.calculations.grandTotal}
              </div>
              <div style={{ fontSize: 10.5, color: '#4B5563', marginTop: 2 }}>
                Payment: {generatedInvoice.paymentMethod} | Ref: {generatedInvoice.transactionRef}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#6B7280', borderTop: '1px dashed #9CA3AF', paddingTop: 6 }}>
              Thank you for visiting! Returns accepted within 7 days against this receipt.
            </div>
          </div>
        )}
      </Modal>

      {/* 4. Shift Closing Summary Modal */}
      <Modal
        title="Shift Closing & Cash Drawer Reconciliation"
        open={isCloseShiftModalOpen}
        onCancel={() => setIsCloseShiftModalOpen(false)}
        onOk={() => {
          if (shiftStatus === 'OPEN') {
            setShiftStatus('CLOSED');
            message.warning('Shift CLOSED. Final reconciliation report generated.');
          } else {
            setShiftStatus('OPEN');
            message.success('Shift OPENED successfully.');
          }
          setIsCloseShiftModalOpen(false);
        }}
        okText={shiftStatus === 'OPEN' ? 'Confirm & Close Shift' : 'Confirm & Open Shift'}
        width={540}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          <p style={{ fontSize: 12.5, color: '#4B5563' }}>
            Verify total collections across tender modes and count physical cash in drawer:
          </p>

          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 12, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Opening Float Cash:</span>
              <strong>₹{openingFloatCash.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cash Sales Collections:</span>
              <strong style={{ color: '#15803D' }}>₹{cashSalesTotal.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>UPI / QR Sales:</span>
              <strong>₹{upiSalesTotal.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Card Sales:</span>
              <strong>₹{cardSalesTotal.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cash In / Cash Out Net:</span>
              <span>₹{cashInOutNet.toLocaleString('en-IN')}</span>
            </div>
            <Divider style={{ margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: BRAND_PURPLE }}>
              <span>Expected Cash in Drawer:</span>
              <span>₹{expectedDrawerCash.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Actual Cash Counted in Drawer (₹):</span>
            <InputNumber
              value={actualDrawerCashInput}
              onChange={(v) => setActualDrawerCashInput(Number(v) || 0)}
              style={{ width: '100%', marginTop: 4, height: 38 }}
              prefix="₹"
            />
          </div>

          <div style={{ background: actualDrawerCashInput === expectedDrawerCash ? '#F0FDF4' : '#FFFBEB', padding: '8px 12px', borderRadius: 6, border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
            <span>Cash Difference:</span>
            <strong style={{ color: actualDrawerCashInput === expectedDrawerCash ? '#15803D' : '#B45309' }}>
              {actualDrawerCashInput - expectedDrawerCash === 0 ? 'Exact Match (₹0.00)' : `₹${actualDrawerCashInput - expectedDrawerCash}`}
            </strong>
          </div>
        </div>
      </Modal>

      {/* 5. Cash In / Out Float Movement Modal */}
      <Modal
        title="Float Management — Cash In / Cash Out"
        open={isCashInOutModalOpen}
        onCancel={() => setIsCashInOutModalOpen(false)}
        onOk={() => {
          if (cashInOutType === 'IN') {
            setCashInOutNet((prev) => prev + cashInOutAmount);
            message.success(`Added ₹${cashInOutAmount} cash to drawer.`);
          } else {
            setCashInOutNet((prev) => prev - cashInOutAmount);
            message.info(`Withdrew ₹${cashInOutAmount} cash from drawer.`);
          }
          setIsCashInOutModalOpen(false);
        }}
        okText="Record Cash Movement"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          <Radio.Group
            value={cashInOutType}
            onChange={(e) => setCashInOutType(e.target.value)}
            buttonStyle="solid"
            style={{ width: '100%', display: 'flex' }}
          >
            <Radio.Button value="IN" style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>
              Cash In (+)
            </Radio.Button>
            <Radio.Button value="OUT" style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>
              Cash Out (-)
            </Radio.Button>
          </Radio.Group>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Amount (₹)</span>
            <InputNumber
              min={10}
              value={cashInOutAmount}
              onChange={(v) => setCashInOutAmount(Number(v) || 0)}
              prefix="₹"
              style={{ width: '100%', marginTop: 4, height: 38 }}
            />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Reason</span>
            <Input
              value={cashInOutReason}
              onChange={(e) => setCashInOutReason(e.target.value)}
              placeholder="e.g. Petty cash replenishment"
              style={{ marginTop: 4, height: 38 }}
            />
          </div>
        </div>
      </Modal>

      {/* 6. Held Bills Modal */}
      <Modal
        title="Held Customer Bills"
        open={isHeldBillsModalOpen}
        onCancel={() => setIsHeldBillsModalOpen(false)}
        footer={null}
        width={520}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {heldBills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF' }}>No held bills active.</div>
          ) : (
            heldBills.map((b) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: '#FAF5FF',
                  border: '1px solid #E9D5FF',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: BRAND_PURPLE, fontSize: 13 }}>Bill #{b.id} ({b.heldAt})</div>
                  <div style={{ fontSize: 11.5, color: '#4B5563' }}>
                    {b.customerName} &bull; {b.items.length} items &bull; <strong>₹{b.total.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleResumeBill(b)}
                    style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
                  >
                    Resume
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => setHeldBills(heldBills.filter((x) => x.id !== b.id))}
                  >
                    Discard
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PosSalesPage;
