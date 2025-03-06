import { z } from "zod";

// Product types
export enum ProductType {
  HomeStandbyGenerator = "Home Standby Generator",
  PortableGenerator = "Portable Generator",
  InverterGenerator = "Inverter Generator",
  PressureWasher = "Pressure Washer",
  WaterTrashPump = "Water/Trash Pump"
}

// Maintenance types
export enum MaintenanceType {
  Initial = "Initial",
  Routine = "Routine",
  LongTerm = "Long Term",
  Special = "Special Consideration"
}

// Health status
export enum HealthStatus {
  Healthy = "Healthy",
  Warning = "Warning",
  Critical = "Critical",
  Neutral = "Neutral"
}

// Notification types
export enum NotificationType {
  MAINTENANCE_DUE = "Maintenance Due",
  CRITICAL_ALERT = "Critical Alert",
  WARNING = "Warning",
  GENERAL = "General"
}

// Notification schema
export const NotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  message: z.string(),
  recipients: z.array(z.string()),
  productId: z.string().optional(),
  createdAt: z.date(),
  read: z.boolean(),
  scheduledFor: z.date().optional()
});

export type Notification = z.infer<typeof NotificationSchema>;

// Contractor schema
export const ContractorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  installers: z.array(z.string()),
  homeowners: z.array(z.string())
});

export type Contractor = z.infer<typeof ContractorSchema>;

// Maintenance record schema
export const MaintenanceRecordSchema = z.object({
  id: z.string(),
  productId: z.string(),
  type: z.nativeEnum(MaintenanceType),
  description: z.string(),
  datePerformed: z.date().optional(),
  hoursAtService: z.number().optional(),
  technician: z.string().optional(),
  notes: z.string().optional()
});

export type MaintenanceRecord = z.infer<typeof MaintenanceRecordSchema>;

// Maintenance recommendation schema
export const MaintenanceRecommendationSchema = z.object({
  id: z.string(),
  productType: z.nativeEnum(ProductType),
  maintenanceType: z.nativeEnum(MaintenanceType),
  description: z.string(),
  hoursInterval: z.number().optional(),
  timeInterval: z.number().optional(), // in months
  intervalDescription: z.string()
});

export type MaintenanceRecommendation = z.infer<typeof MaintenanceRecommendationSchema>;

// Product schema
export const ProductSchema = z.object({
  id: z.string(),
  serialNumber: z.string(),
  name: z.string(),
  type: z.nativeEnum(ProductType),
  manufacturer: z.string(),
  model: z.string(),
  installDate: z.date(),
  lastServiceDate: z.date().optional(),
  totalHoursRun: z.number(),
  status: z.nativeEnum(HealthStatus),
  owner: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional()
  }),
  installer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional()
  }),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }),
  // Usage patterns: hourly breakdown of usage over the past week
  weeklyUsage: z.array(z.number()),
  // Maintenance history: past maintenance records
  maintenanceHistory: z.array(MaintenanceRecordSchema).optional(),
  // Next scheduled maintenance date
  nextMaintenanceDate: z.date().optional(),
  // Time until next maintenance (in hours)
  hoursUntilMaintenance: z.number().optional(),
  // Performance metrics (0-100)
  performanceMetrics: z.object({
    efficiency: z.number().min(0).max(100),
    reliability: z.number().min(0).max(100),
    emissions: z.number().min(0).max(100)
  }).optional()
});

export type Product = z.infer<typeof ProductSchema>;

// Maintenance recommendations based on product type
export const maintenanceRecommendations: MaintenanceRecommendation[] = [
  // Home Standby Generator
  {
    id: "rec-1",
    productType: ProductType.HomeStandbyGenerator,
    maintenanceType: MaintenanceType.Initial,
    description: "First oil & filter change",
    hoursInterval: 25,
    intervalDescription: "First ~25 hours"
  },
  {
    id: "rec-2",
    productType: ProductType.HomeStandbyGenerator,
    maintenanceType: MaintenanceType.Routine,
    description: "Oil & filter change",
    hoursInterval: 200,
    timeInterval: 24, // 2 years
    intervalDescription: "Every 200 hours or 2 years"
  },
  {
    id: "rec-3",
    productType: ProductType.HomeStandbyGenerator,
    maintenanceType: MaintenanceType.LongTerm,
    description: "Full tune-up (spark plug, air filter, valve check)",
    hoursInterval: 400,
    intervalDescription: "Every 400 hours"
  },
  {
    id: "rec-4",
    productType: ProductType.HomeStandbyGenerator,
    maintenanceType: MaintenanceType.Special,
    description: "Keep vents clear; check battery condition periodically",
    intervalDescription: "Periodically"
  },
  
  // Portable Generator
  {
    id: "rec-5",
    productType: ProductType.PortableGenerator,
    maintenanceType: MaintenanceType.Initial,
    description: "First oil change",
    hoursInterval: 25,
    intervalDescription: "First ~20-30 hours"
  },
  {
    id: "rec-6",
    productType: ProductType.PortableGenerator,
    maintenanceType: MaintenanceType.Routine,
    description: "Oil change",
    hoursInterval: 100,
    timeInterval: 12, // 1 year
    intervalDescription: "Every 100 hours or annually"
  },
  {
    id: "rec-7",
    productType: ProductType.PortableGenerator,
    maintenanceType: MaintenanceType.LongTerm,
    description: "Spark plug & air filter replacement",
    hoursInterval: 200,
    timeInterval: 12, // 1 year
    intervalDescription: "Every 200 hours or annually"
  },
  {
    id: "rec-8",
    productType: ProductType.PortableGenerator,
    maintenanceType: MaintenanceType.Special,
    description: "Use fresh fuel, drain if storing for more than 30 days",
    intervalDescription: "As needed"
  },
  
  // Inverter Generator
  {
    id: "rec-9",
    productType: ProductType.InverterGenerator,
    maintenanceType: MaintenanceType.Initial,
    description: "First oil change",
    hoursInterval: 25,
    intervalDescription: "First ~20-30 hours"
  },
  {
    id: "rec-10",
    productType: ProductType.InverterGenerator,
    maintenanceType: MaintenanceType.Routine,
    description: "Oil change",
    hoursInterval: 100,
    timeInterval: 12, // 1 year
    intervalDescription: "Every 100 hours or annually"
  },
  {
    id: "rec-11",
    productType: ProductType.InverterGenerator,
    maintenanceType: MaintenanceType.LongTerm,
    description: "Air filter cleaning",
    hoursInterval: 50,
    intervalDescription: "Every 50 hours, replace at 200 hours"
  },
  {
    id: "rec-12",
    productType: ProductType.InverterGenerator,
    maintenanceType: MaintenanceType.Special,
    description: "Store with stabilized fuel, clean carburetor if stored long-term",
    intervalDescription: "As needed"
  },
  
  // Pressure Washer
  {
    id: "rec-13",
    productType: ProductType.PressureWasher,
    maintenanceType: MaintenanceType.Initial,
    description: "First oil change",
    hoursInterval: 5,
    intervalDescription: "After ~5 hours"
  },
  {
    id: "rec-14",
    productType: ProductType.PressureWasher,
    maintenanceType: MaintenanceType.Routine,
    description: "Engine oil change; air filter checks",
    timeInterval: 12, // 1 year
    intervalDescription: "Annually or per manual"
  },
  {
    id: "rec-15",
    productType: ProductType.PressureWasher,
    maintenanceType: MaintenanceType.LongTerm,
    description: "Pump maintenance (if required)",
    intervalDescription: "Per manufacturer's schedule"
  },
  {
    id: "rec-16",
    productType: ProductType.PressureWasher,
    maintenanceType: MaintenanceType.Special,
    description: "Never run pump dry; flush after detergent use",
    intervalDescription: "After each use"
  },
  
  // Water/Trash Pump
  {
    id: "rec-17",
    productType: ProductType.WaterTrashPump,
    maintenanceType: MaintenanceType.Initial,
    description: "First oil change",
    hoursInterval: 5,
    intervalDescription: "After ~5 hours"
  },
  {
    id: "rec-18",
    productType: ProductType.WaterTrashPump,
    maintenanceType: MaintenanceType.Routine,
    description: "Oil change",
    timeInterval: 12, // 1 year
    intervalDescription: "Annually or per hours listed in the manual"
  },
  {
    id: "rec-19",
    productType: ProductType.WaterTrashPump,
    maintenanceType: MaintenanceType.LongTerm,
    description: "Inspect impeller & seals",
    intervalDescription: "Periodically"
  },
  {
    id: "rec-20",
    productType: ProductType.WaterTrashPump,
    maintenanceType: MaintenanceType.Special,
    description: "Drain water before storage to prevent freezing",
    intervalDescription: "Before storage"
  }
];

// Generate realistic date intervals for the past year
const getRandomDateInPast = (maxDaysAgo: number): Date => {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Generate random weekly usage data (hours per day for a week)
const generateWeeklyUsage = (): number[] => {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 10));
};

// Generate random performance metrics
const generatePerformanceMetrics = (): { efficiency: number; reliability: number; emissions: number } => {
  return {
    efficiency: 75 + Math.floor(Math.random() * 25), // 75-100
    reliability: 70 + Math.floor(Math.random() * 30), // 70-100
    emissions: 60 + Math.floor(Math.random() * 40) // 60-100
  };
};

// Determine health status based on hours, last service, etc.
const determineHealthStatus = (
  hoursRun: number,
  installDate: Date,
  lastServiceDate?: Date
): HealthStatus => {
  const daysSinceInstall = Math.floor((new Date().getTime() - installDate.getTime()) / (1000 * 3600 * 24));
  const daysSinceService = lastServiceDate 
    ? Math.floor((new Date().getTime() - lastServiceDate.getTime()) / (1000 * 3600 * 24))
    : daysSinceInstall;
  
  // Higher hours + longer time since service = more likely to have issues
  if (hoursRun > 350 && daysSinceService > 300) {
    return HealthStatus.Critical;
  } else if ((hoursRun > 200 && daysSinceService > 180) || (hoursRun > 300)) {
    return HealthStatus.Warning;
  } else {
    return HealthStatus.Healthy;
  }
};

// Generate random maintenance history
const generateMaintenanceHistory = (productId: string, installDate: Date, hoursRun: number): MaintenanceRecord[] => {
  const records: MaintenanceRecord[] = [];
  const installDateMs = installDate.getTime();
  const nowMs = new Date().getTime();
  
  // If recently installed, might not have any records yet
  if ((nowMs - installDateMs) < (30 * 24 * 60 * 60 * 1000)) {
    return [];
  }
  
  // Initial service
  records.push({
    id: `maint-${productId}-1`,
    productId,
    type: MaintenanceType.Initial,
    description: "Initial maintenance service",
    datePerformed: new Date(installDateMs + (14 * 24 * 60 * 60 * 1000)), // 14 days after install
    hoursAtService: 25,
    technician: "John Smith",
    notes: "Initial service completed per manufacturer guidelines."
  });
  
  // Add 1-3 additional records if the unit has been running for a while
  if (hoursRun > 100) {
    const midPointMs = installDateMs + ((nowMs - installDateMs) / 2);
    
    records.push({
      id: `maint-${productId}-2`,
      productId,
      type: MaintenanceType.Routine,
      description: "Routine maintenance service",
      datePerformed: new Date(midPointMs),
      hoursAtService: Math.floor(hoursRun / 2),
      technician: "Alice Johnson",
      notes: "Routine oil change and inspection. System operating within normal parameters."
    });
    
    if (hoursRun > 300) {
      records.push({
        id: `maint-${productId}-3`,
        productId,
        type: MaintenanceType.LongTerm,
        description: "Long-term maintenance service",
        datePerformed: new Date(midPointMs + ((nowMs - midPointMs) / 2)),
        hoursAtService: Math.floor(hoursRun * 0.75),
        technician: "Bob Williams",
        notes: "Full tune-up performed. Replaced spark plugs and air filter."
      });
    }
  }
  
  return records;
};

// Calculate time until next maintenance
const calculateNextMaintenance = (
  productType: ProductType,
  hoursRun: number,
  lastServiceDate?: Date
): { date: Date; hours: number } => {
  // Find relevant recommendation for this product type
  const relevantRecs = maintenanceRecommendations.filter(rec => 
    rec.productType === productType && 
    rec.maintenanceType === MaintenanceType.Routine
  );
  
  if (relevantRecs.length === 0) {
    // Fallback if no specific recommendation found
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 3);
    return { date: nextDate, hours: 100 };
  }
  
  const recommendation = relevantRecs[0];
  const hoursInterval = recommendation.hoursInterval || 100;
  const monthsInterval = recommendation.timeInterval || 12;
  
  // Calculate next service by hours
  const hoursRemaining = Math.max(0, hoursInterval - (hoursRun % hoursInterval));
  
  // Calculate next service by date
  const nextServiceDate = new Date();
  if (lastServiceDate) {
    nextServiceDate.setTime(lastServiceDate.getTime());
    nextServiceDate.setMonth(nextServiceDate.getMonth() + monthsInterval);
  } else {
    nextServiceDate.setMonth(nextServiceDate.getMonth() + monthsInterval);
  }
  
  // Return the earlier of the two calculations
  const hourBasedDate = new Date();
  // Assume 1 hour of operation per day on average
  hourBasedDate.setDate(hourBasedDate.getDate() + hoursRemaining);
  
  if (hourBasedDate < nextServiceDate) {
    return { date: hourBasedDate, hours: hoursRemaining };
  } else {
    // Convert time difference to approximate hours
    const hoursDiff = (nextServiceDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    return { date: nextServiceDate, hours: Math.max(0, Math.floor(hoursDiff)) };
  }
};

// Generate mock products
export const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = `prod-${i + 1}`;
    const productTypes = Object.values(ProductType);
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    
    const installDate = getRandomDateInPast(365 * 2); // Up to 2 years ago
    const lastServiceDate = getRandomDateInPast(180); // Up to 6 months ago
    
    const totalHoursRun = 50 + Math.floor(Math.random() * 450); // 50-500 hours
    
    const maintenanceHistory = generateMaintenanceHistory(id, installDate, totalHoursRun);
    
    const status = determineHealthStatus(totalHoursRun, installDate, lastServiceDate);
    
    const nextMaintenance = calculateNextMaintenance(productType, totalHoursRun, lastServiceDate);
    
    products.push({
      id,
      serialNumber: `SN-${100000 + i}`,
      name: `${productType} ${Math.floor(Math.random() * 5000) + 5000}W`,
      type: productType,
      manufacturer: "Generac",
      model: `Model ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${1000 + i}`,
      installDate,
      lastServiceDate,
      totalHoursRun,
      status,
      owner: {
        id: `owner-${i + 1}`,
        name: `Homeowner ${i + 1}`,
        email: `homeowner${i + 1}@example.com`,
        phone: `(555) ${100 + i}-${1000 + i}`
      },
      installer: {
        id: `installer-${Math.floor(i / 3) + 1}`, // Each installer handles multiple units
        name: `Installer Company ${Math.floor(i / 3) + 1}`,
        email: `installer${Math.floor(i / 3) + 1}@example.com`,
        phone: `(555) ${200 + Math.floor(i / 3)}-${2000 + Math.floor(i / 3)}`
      },
      location: {
        address: `${1000 + i} Main St`,
        city: ["Springfield", "Riverdale", "Centerville", "Oakwood", "Pine Valley"][i % 5],
        state: ["NY", "CA", "TX", "FL", "IL"][i % 5],
        zip: `${10000 + (i * 123) % 90000}`
      },
      weeklyUsage: generateWeeklyUsage(),
      maintenanceHistory,
      nextMaintenanceDate: nextMaintenance.date,
      hoursUntilMaintenance: nextMaintenance.hours,
      performanceMetrics: generatePerformanceMetrics()
    });
  }
  
  return products;
};

// Generate 10 mock products
export const mockProducts = generateMockProducts(10);

// Get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Get recommendations for a specific product
export const getRecommendationsForProduct = (product: Product): MaintenanceRecommendation[] => {
  return maintenanceRecommendations.filter(rec => rec.productType === product.type);
};

// Generate a warning or alert message based on product status
export const generateAlertMessage = (product: Product): string | null => {
  switch (product.status) {
    case HealthStatus.Critical:
      return `Immediate attention required: ${product.name} has critical indicators and may fail soon.`;
    case HealthStatus.Warning:
      return `Maintenance recommended: ${product.name} is showing early warning signs.`;
    case HealthStatus.Healthy:
      if (product.hoursUntilMaintenance && product.hoursUntilMaintenance < 50) {
        return `Upcoming maintenance: ${product.name} will need service in approximately ${product.hoursUntilMaintenance} hours.`;
      }
      return null;
    default:
      return null;
  }
};

// Generate mock notifications
export const generateMockNotifications = (count: number): Notification[] => {
  const notifications: Notification[] = [];
  
  for (let i = 0; i < count; i++) {
    const notificationTypes = Object.values(NotificationType);
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    let title = "";
    let message = "";
    
    switch (type) {
      case NotificationType.MAINTENANCE_DUE:
        title = "Scheduled Maintenance Due";
        message = `Maintenance is due for your ${["generator", "pressure washer", "pump"][i % 3]} in the next 30 days. Please schedule service.`;
        break;
      case NotificationType.CRITICAL_ALERT:
        title = "Critical System Alert";
        message = "Your system has reported critical issues that require immediate attention. Please contact service.";
        break;
      case NotificationType.WARNING:
        title = "System Warning";
        message = "Your system has reported unusual behavior. Consider scheduling a check-up.";
        break;
      default:
        title = "System Update";
        message = "Your system has received a software update with improved features.";
    }
    
    notifications.push({
      id: `notif-${i + 1}`,
      type,
      title,
      message,
      recipients: [`homeowner-${(i % 5) + 1}`],
      productId: `prod-${(i % 10) + 1}`,
      createdAt: getRandomDateInPast(i * 2),
      read: i > (count / 2),
      scheduledFor: i % 3 === 0 ? new Date(new Date().setDate(new Date().getDate() + i)) : undefined
    });
  }
  
  return notifications;
};

// Generate mock contractors
export const generateMockContractors = (count: number): Contractor[] => {
  const contractors: Contractor[] = [];
  
  for (let i = 0; i < count; i++) {
    contractors.push({
      id: `contractor-${i + 1}`,
      name: `Contractor Company ${i + 1}`,
      email: `contact@contractor${i + 1}.com`,
      phone: `(555) ${100 + i}-${2000 + i}`,
      company: `Power Maintenance Solutions ${i + 1}`,
      installers: Array.from({ length: 3 }, (_, j) => `installer-${j + 1 + (i * 3)}`),
      homeowners: Array.from({ length: 5 }, (_, j) => `owner-${j + 1 + (i * 5)}`)
    });
  }
  
  return contractors;
};

// Generate mock data
export const mockNotifications = generateMockNotifications(10);
export const mockContractors = generateMockContractors(3);
