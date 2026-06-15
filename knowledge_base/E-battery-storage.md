---
title: "Solar Battery Storage Systems (ESS)"
description: "Complete guide to battery storage systems for solar - Huawei, SolarEdge specifications and benefits"
category: "products"
tags: ["battery", "storage", "ess", "backup", "luna2000", "solaredge-battery"]
last_updated: "2026-03-19"
version: "2.0"
---

# Energy Storage System (ESS)

> **Short Answer**: Batteries store excess solar energy for use at night or during power outages. They serve as backup power and increase energy independence.

---

## 💬 Customer Explanation

### Why add a battery?

1. **Backup Power**: Keep lights, refrigerators, and internet running during outages (if configured for "Islanding").
2. **TOU (Time-of-Use) Savings**: Store cheap solar energy during the day and use it at night when electricity rates are higher.
3. **Energy Independence**: Reduce reliance on the grid and protect against future price hikes.

**Note**: Standard solar systems **do not** work during a power outage unless a battery with "Islanding" capability is installed.

---

## ⚙️ Technical Specifications

### Battery Chemistry & Specs

| Feature | Value |
|-----------|-----|
| **Battery Chemistry** | Lithium Iron Phosphate (LFP) - Safer and longer-lasting |
| **Capacity** | Measured in kWh (e.g., 7/14/21 kWh) |
| **Power Output** | Measured in kW (how many loads can run simultaneously) |
| **Depth of Discharge (DoD)** | 100% Usable (NextE Standard) |
| **Cycle Life** | 6,000–10,000 cycles before capacity drops to 70% |

### Popular Models

#### **Residential**
- **Huawei Luna2000**: LUNA2000-7kWh/14kWh/21kWh (48V)
- **Huawei Luna2000**: LUNA2000-5kWh/10kWh/15kWh (400V)
- **SolarEdge Home Battery**: 9.7 kWh (400V)

#### **Commercial/Industrial**
- **Huawei**: LUNA2000-107kWh/161kWh/215kWh
- **SolarEdge**: 102.4 kWh

### System Compatibility

| Inverter | Max Battery Support |
|----------|---------------------|
| **Huawei M1/MAP0** | 2 ESS units |
| **Huawei MB0** | 4 ESS units |
| **Huawei L1/LC0** | 2 ESS units |

---

## 💰 Pricing & Benefits

### Cost vs. Value

**Price Range**: Generally 100,000–300,000+ THB (fully installed for residential, depending on capacity).

**Incentives**:
- Solar-charged batteries may be eligible for tax credits (depending on government policy).
- Increases home value and energy autonomy.

---

## 🔄 Workflow

### Battery Integration

1. **Load Analysis**: Identify critical loads (fridge, lights, AC) to determine the right battery size.
2. **Electrical Panel Upgrade**: May require a Critical Loads Panel or a mainboard upgrade for backup integration.
3. **Permitting**: Additional electrical safety standards apply (battery and installation codes).
4. **Configuration**: Set the system to "Self-Consumption" or "Backup Only" modes via the app.

---

## ❓ FAQ

**Q: How long will the battery last during an outage?** **A**: It depends on usage. A 13.5 kWh battery can power essential loads (lights, WiFi, fridge) for 1–3 days. Running AC or heaters will significantly reduce this time.

**Q: Can I add a battery later?** **A**: Yes, but integration costs may be higher than doing it during the initial solar install. Some inverters are "Battery-ready."

**Q: Are batteries safe?** **A**: Yes. Modern LFP batteries have advanced Battery Management Systems (BMS) to prevent overheating. NextE strictly follows Engineering Institute of Thailand standards.

**Q: What is the payback period?** **A**: Typically 7-10 years, depending on usage and electricity rates. However, it provides immediate energy security and backup benefits.

---

## 📊 System Comparison

| Feature | Huawei Luna2000 | SolarEdge Battery |
|-----------|-----------------|-------------------|
| **Capacity** | 5-21 kWh (48V/400V) | 9.7 kWh (400V) |
| **Round Trip Efficiency** | 90%+ | **94.5%** ⭐ |
| **Warranty** | 10 Years | 10 Years (unlimited cycles) |
| **Continuous Power** | 5kW | 5kW |
| **Peak Power** | 5kW | **7.5kW** (10 seconds) |
| **Installation** | Indoor/Outdoor | Indoor/Outdoor (IP55) |

---

## 💡 Usage Scenarios

### 1. Low FIT/Curtailment
- Store power for personal use rather than selling it back.
- Increase energy self-consumption.

### 2. Peak Staggering
- Store power when it's cheap (daytime).
- Use power when it's expensive (nighttime).
- Reduce electricity bills by 30-50%.

### 3. Backup Power
- Emergency power during outages.
- Whole Home Backup or Partial Backup.
- Switchover time: 20ms (Huawei MAP0).

---

## 🔗 Related Documents
- [Inverters](./inverter.md) - Battery-compatible inverters.
- [Process](./process.md) - Installation steps.
- [Package Jinko](./package-jinko.md) - Packages including batteries.