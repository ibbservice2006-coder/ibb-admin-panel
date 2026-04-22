import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Search, RefreshCw, Download, MapPin, Route, Car, Bus,
  ChevronLeft, ChevronRight, Eye, Edit
} from 'lucide-react'

// ===== REAL ROUTE DATA FROM ibbservice.com/pricing =====

const carRoutes = [
  // Airport Transfer
  { id: 1, zone: 'Airport Transfer', distance: '26 km', destination: 'Bangkok - Don Mueang Airport', std: 1100, exec: 1300, family: 1300, electric: 1300, limo_premium: 3500, limo_luxury: 5000 },
  { id: 2, zone: 'Airport Transfer', distance: '32 km', destination: 'Bangkok - Suvarnabhumi Airport', std: 1100, exec: 1300, family: 1300, electric: 1300, limo_premium: 3500, limo_luxury: 5000 },
  { id: 3, zone: 'Airport Transfer', distance: '178 km', destination: 'Bangkok - Utapao Airport', std: 3000, exec: 3300, family: 3300, electric: 3300, limo_premium: 15000, limo_luxury: 16500 },
  // Central Region
  { id: 4, zone: 'Central Region', distance: '35 km', destination: 'Bangkok - Nonthaburi', std: 1100, exec: 1300, family: 1300, electric: 1300, limo_premium: null, limo_luxury: null },
  { id: 5, zone: 'Central Region', distance: '45 km', destination: 'Bangkok - Pathum Thani', std: 1500, exec: 1500, family: 1500, electric: 1500, limo_premium: null, limo_luxury: null },
  { id: 6, zone: 'Central Region', distance: '51 km', destination: 'Bangkok - Samut Prakan', std: 1700, exec: 1800, family: 1800, electric: 2000, limo_premium: null, limo_luxury: null },
  { id: 7, zone: 'Central Region', distance: '59 km', destination: 'Bangkok - Samut Sakhon', std: 1800, exec: 2100, family: 2100, electric: 2100, limo_premium: null, limo_luxury: null },
  { id: 8, zone: 'Central Region', distance: '69 km', destination: 'Bangkok - Nakhon Pathom', std: 2200, exec: 2500, family: 2500, electric: 2500, limo_premium: 9500, limo_luxury: 10900 },
  { id: 9, zone: 'Central Region', distance: '78 km', destination: 'Bangkok - Chachoengsao', std: 2300, exec: 2600, family: 2600, electric: 2600, limo_premium: null, limo_luxury: null },
  // East
  { id: 10, zone: 'The East of Thailand', distance: '100 km', destination: 'Bangkok - Bangsean', std: 2100, exec: 2400, family: 2400, electric: 2400, limo_premium: null, limo_luxury: null },
  { id: 11, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Chon Buri', std: 2200, exec: 2500, family: 2500, electric: 2500, limo_premium: null, limo_luxury: null },
  { id: 12, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Pattaya', std: 2600, exec: 2850, family: 2850, electric: 2850, limo_premium: 10000, limo_luxury: 12500 },
  { id: 13, zone: 'The East of Thailand', distance: '130 km', destination: 'Bangkok - Laem Chabang', std: 2800, exec: 3000, family: 3000, electric: 3000, limo_premium: 10000, limo_luxury: 13500 },
  { id: 14, zone: 'The East of Thailand', distance: '200 km', destination: 'Bangkok - Sathahip', std: 2800, exec: 3000, family: 3000, electric: 3000, limo_premium: 12500, limo_luxury: 13500 },
  { id: 15, zone: 'The East of Thailand', distance: '220 km', destination: 'Bangkok - Rayong', std: 3200, exec: 3500, family: 3500, electric: 3500, limo_premium: 15000, limo_luxury: 16500 },
  { id: 16, zone: 'The East of Thailand', distance: '242 km', destination: 'Bangkok - Ban Phae Pier', std: 3500, exec: 3800, family: 3800, electric: 3800, limo_premium: 15300, limo_luxury: 16800 },
  { id: 17, zone: 'The East of Thailand', distance: '275 km', destination: 'Bangkok - Chanthaburi', std: 3800, exec: 4000, family: 4000, electric: 4000, limo_premium: null, limo_luxury: null },
  { id: 18, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Aranyaprathet', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 19, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Sa Kaeo', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 20, zone: 'The East of Thailand', distance: '400 km', destination: 'Bangkok - Trat', std: 5300, exec: 5500, family: 5500, electric: 5500, limo_premium: 22000, limo_luxury: 24000 },
  { id: 21, zone: 'The East of Thailand', distance: '420 km', destination: 'Bangkok - Hat Lek', std: 5800, exec: 6000, family: 6000, electric: 6000, limo_premium: null, limo_luxury: null },
  { id: 22, zone: 'The East of Thailand', distance: '450 km', destination: 'Bangkok - Koh Chang', std: 6000, exec: 6500, family: 6500, electric: 6500, limo_premium: null, limo_luxury: null },
  // South
  { id: 23, zone: 'The South of Thailand', distance: '99 km', destination: 'Bangkok - Samut Songkhram', std: 2400, exec: 2700, family: 2700, electric: 2700, limo_premium: null, limo_luxury: null },
  { id: 24, zone: 'The South of Thailand', distance: '200 km', destination: 'Bangkok - Cha-Am', std: 3300, exec: 3500, family: 3500, electric: 3500, limo_premium: 13000, limo_luxury: 15000 },
  { id: 25, zone: 'The South of Thailand', distance: '220 km', destination: 'Bangkok - Hua Hin', std: 3500, exec: 3800, family: 3800, electric: 3800, limo_premium: 13000, limo_luxury: 15000 },
  { id: 26, zone: 'The South of Thailand', distance: '245 km', destination: 'Bangkok - Pranburi', std: 3800, exec: 4100, family: 4100, electric: 4100, limo_premium: 15000, limo_luxury: 16500 },
  { id: 27, zone: 'The South of Thailand', distance: '300 km', destination: 'Bangkok - Kui Buri', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 28, zone: 'The South of Thailand', distance: '265 km', destination: 'Bangkok - Sam Roi Yot', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 29, zone: 'The South of Thailand', distance: '380 km', destination: 'Bangkok - Bang Saphan', std: 5300, exec: 5500, family: 5500, electric: 5500, limo_premium: 17000, limo_luxury: null },
  { id: 30, zone: 'The South of Thailand', distance: '500 km', destination: 'Bangkok - Chumphon', std: 6500, exec: 7200, family: 7200, electric: 7200, limo_premium: 25000, limo_luxury: null },
  { id: 31, zone: 'The South of Thailand', distance: '867 km', destination: 'Bangkok - Phuket', std: 12500, exec: 14500, family: 14500, electric: 14500, limo_premium: 40000, limo_luxury: null },
  { id: 32, zone: 'The South of Thailand', distance: '710 km', destination: 'Bangkok - Don Sak', std: 12500, exec: 15000, family: 15000, electric: 15000, limo_premium: null, limo_luxury: null },
  { id: 33, zone: 'The South of Thailand', distance: '644 km', destination: 'Bangkok - Surat Thani', std: 13000, exec: 15000, family: 15000, electric: 15000, limo_premium: null, limo_luxury: null },
  { id: 34, zone: 'The South of Thailand', distance: '946 km', destination: 'Bangkok - Krabi', std: 14500, exec: 15500, family: 15500, electric: 15500, limo_premium: null, limo_luxury: null },
  // West
  { id: 35, zone: 'The West of Thailand', distance: '165 km', destination: 'Bangkok - Ratchaburi', std: 2800, exec: 3100, family: 3100, electric: 3100, limo_premium: null, limo_luxury: null },
  { id: 36, zone: 'The West of Thailand', distance: '130 km', destination: 'Bangkok - Kanchanaburi', std: 3200, exec: 3500, family: 3500, electric: 3500, limo_premium: 11500, limo_luxury: 14000 },
  { id: 37, zone: 'The West of Thailand', distance: '235 km', destination: 'Bangkok - Sai Yok', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 38, zone: 'The West of Thailand', distance: '380 km', destination: 'Bangkok - Sangkhla Buri', std: 6500, exec: 7200, family: 7200, electric: 7200, limo_premium: null, limo_luxury: null },
  // North
  { id: 39, zone: 'The North of Thailand', distance: '76 km', destination: 'Bangkok - Ayutthaya', std: 2300, exec: 2500, family: 2500, electric: 2500, limo_premium: 8750, limo_luxury: 10000 },
  { id: 40, zone: 'The North of Thailand', distance: '260 km', destination: 'Bangkok - Nakhon Sawan', std: 3800, exec: 4000, family: 4000, electric: 4000, limo_premium: null, limo_luxury: null },
  { id: 41, zone: 'The North of Thailand', distance: '350 km', destination: 'Bangkok - Phetchabun', std: null, exec: 7000, family: 7000, electric: 7000, limo_premium: null, limo_luxury: null },
  { id: 42, zone: 'The North of Thailand', distance: '400 km', destination: 'Bangkok - Phitsanulok', std: 6300, exec: 7000, family: 7000, electric: 7000, limo_premium: 17000, limo_luxury: null },
  { id: 43, zone: 'The North of Thailand', distance: '500 km', destination: 'Bangkok - Sukhothai', std: 7500, exec: 8000, family: 8000, electric: 8000, limo_premium: null, limo_luxury: null },
  { id: 44, zone: 'The North of Thailand', distance: '519 km', destination: 'Bangkok - Mae Sot - Tak', std: 7800, exec: 8200, family: 8200, electric: 8200, limo_premium: null, limo_luxury: null },
  { id: 45, zone: 'The North of Thailand', distance: '695 km', destination: 'Bangkok - Chiang Mai', std: 12500, exec: 15000, family: 15000, electric: 15000, limo_premium: 34000, limo_luxury: null },
  { id: 46, zone: 'The North of Thailand', distance: '820 km', destination: 'Bangkok - Chiang Rai', std: 14500, exec: 16500, family: 16500, electric: 16500, limo_premium: null, limo_luxury: null },
  // Northeast
  { id: 47, zone: 'The Northeast of Thailand', distance: '107 km', destination: 'Bangkok - Saraburi', std: 2500, exec: 2800, family: 2800, electric: 2800, limo_premium: null, limo_luxury: null },
  { id: 48, zone: 'The Northeast of Thailand', distance: '165 km', destination: 'Bangkok - Khao Yai', std: 3500, exec: 3800, family: 3800, electric: 3800, limo_premium: 10500, limo_luxury: 15000 },
  { id: 49, zone: 'The Northeast of Thailand', distance: '246 km', destination: 'Bangkok - Wang Nam Khiao', std: 3800, exec: 4100, family: 4100, electric: 4100, limo_premium: null, limo_luxury: null },
  { id: 50, zone: 'The Northeast of Thailand', distance: '299 km', destination: 'Bangkok - Nakhon Ratchasima', std: 3800, exec: 4000, family: 4000, electric: 4000, limo_premium: 11500, limo_luxury: null },
  // Hourly
  { id: 51, zone: 'Hourly', distance: '4 Hrs', destination: '04 Hours: Private Car Rental with Driver & Fuel (Max 250 Km.)', std: 2200, exec: 2600, family: 2600, electric: 2600, limo_premium: 7500, limo_luxury: 10000 },
  { id: 52, zone: 'Hourly', distance: '6 Hrs', destination: '06 Hours: Private Car Rental with Driver & Fuel (Max 300 Km.)', std: 3300, exec: 3900, family: 3900, electric: 3900, limo_premium: 9000, limo_luxury: 15000 },
  { id: 53, zone: 'Hourly', distance: '8 Hrs', destination: '08 Hours: Private Car Rental with Driver & Fuel (Max 350 Km.)', std: 4200, exec: 5000, family: 5000, electric: 5000, limo_premium: 12000, limo_luxury: 20000 },
  { id: 54, zone: 'Hourly', distance: '10 Hrs', destination: '10 Hours: Private Car Rental with Driver & Fuel (Max 400 Km.)', std: 5250, exec: 6250, family: 6250, electric: 6250, limo_premium: 15000, limo_luxury: 25000 },
  // Period
  { id: 55, zone: 'Period', distance: '1 Day', destination: '01 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 4200, exec: 5000, family: 5000, electric: 5000, limo_premium: 12000, limo_luxury: 20000 },
  { id: 56, zone: 'Period', distance: '7 Days', destination: '07 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 25000, exec: 30000, family: 30000, electric: 30000, limo_premium: 84000, limo_luxury: 140000 },
  { id: 57, zone: 'Period', distance: '15 Days', destination: '15 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 50000, exec: 60000, family: 60000, electric: 60000, limo_premium: 180000, limo_luxury: 300000 },
  { id: 58, zone: 'Period', distance: '30 Days', destination: '30 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 85000, exec: 100000, family: 100000, electric: 100000, limo_premium: 350000, limo_luxury: 600000 },
]

const vanRoutes = [
  // Airport Transfer
  { id: 1, zone: 'Airport Transfer', distance: '26 km', destination: 'Bangkok - Don Mueang Airport', std: 1400, exec: 1600, premium: 3500, luxury: 10000 },
  { id: 2, zone: 'Airport Transfer', distance: '32 km', destination: 'Bangkok - Suvarnabhumi Airport', std: 1400, exec: 1600, premium: 3500, luxury: 10000 },
  { id: 3, zone: 'Airport Transfer', distance: '178 km', destination: 'Bangkok - Utapao Airport', std: 3800, exec: 4000, premium: 15000, luxury: null },
  // Central
  { id: 4, zone: 'Central Region', distance: '35 km', destination: 'Bangkok - Nonthaburi', std: 1400, exec: 1600, premium: null, luxury: 18000 },
  { id: 5, zone: 'Central Region', distance: '45 km', destination: 'Bangkok - Pathum Thani', std: 2200, exec: 2400, premium: null, luxury: null },
  { id: 6, zone: 'Central Region', distance: '51 km', destination: 'Bangkok - Samut Prakan', std: 2200, exec: 2400, premium: null, luxury: null },
  { id: 7, zone: 'Central Region', distance: '59 km', destination: 'Bangkok - Samut Sakhon', std: 2400, exec: 2600, premium: null, luxury: null },
  { id: 8, zone: 'Central Region', distance: '69 km', destination: 'Bangkok - Nakhon Pathom', std: 2800, exec: 3000, premium: 12300, luxury: null },
  { id: 9, zone: 'Central Region', distance: '78 km', destination: 'Bangkok - Chachoengsao', std: 2800, exec: 3000, premium: 12000, luxury: null },
  // East
  { id: 10, zone: 'The East of Thailand', distance: '100 km', destination: 'Bangkok - Bangsean', std: 2600, exec: 2800, premium: null, luxury: null },
  { id: 11, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Chon Buri', std: 2800, exec: 3000, premium: 10000, luxury: null },
  { id: 12, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Pattaya', std: 3600, exec: 3800, premium: 10000, luxury: 22000 },
  { id: 13, zone: 'The East of Thailand', distance: '130 km', destination: 'Bangkok - Laem Chabang', std: 3800, exec: 4000, premium: 10000, luxury: 23500 },
  { id: 14, zone: 'The East of Thailand', distance: '200 km', destination: 'Bangkok - Sathahip', std: 3800, exec: 4000, premium: 12000, luxury: null },
  { id: 15, zone: 'The East of Thailand', distance: '220 km', destination: 'Bangkok - Rayong', std: 3800, exec: 4000, premium: 15000, luxury: 28000 },
  { id: 16, zone: 'The East of Thailand', distance: '242 km', destination: 'Bangkok - Ban Phae Pier', std: 4100, exec: 4300, premium: 15300, luxury: 28300 },
  { id: 17, zone: 'The East of Thailand', distance: '275 km', destination: 'Bangkok - Chanthaburi', std: 4300, exec: 4500, premium: 13000, luxury: 33000 },
  { id: 18, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Aranyaprathet', std: 4800, exec: 5000, premium: null, luxury: null },
  { id: 19, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Sa Kaeo', std: 4900, exec: 5100, premium: null, luxury: null },
  { id: 20, zone: 'The East of Thailand', distance: '400 km', destination: 'Bangkok - Trat', std: 6800, exec: 7000, premium: 22000, luxury: 30000 },
  { id: 21, zone: 'The East of Thailand', distance: '420 km', destination: 'Bangkok - Hat Lek', std: 7300, exec: 7500, premium: null, luxury: null },
  { id: 22, zone: 'The East of Thailand', distance: '450 km', destination: 'Bangkok - Koh Chang', std: 7800, exec: 8000, premium: 16000, luxury: null },
  // South
  { id: 23, zone: 'The South of Thailand', distance: '99 km', destination: 'Bangkok - Samut Songkhram', std: 2600, exec: 2800, premium: null, luxury: null },
  { id: 24, zone: 'The South of Thailand', distance: '200 km', destination: 'Bangkok - Cha-Am', std: 3800, exec: 4000, premium: 13000, luxury: 25000 },
  { id: 25, zone: 'The South of Thailand', distance: '220 km', destination: 'Bangkok - Hua Hin', std: 4300, exec: 4500, premium: 13000, luxury: 33000 },
  { id: 26, zone: 'The South of Thailand', distance: '245 km', destination: 'Bangkok - Pranburi', std: 4800, exec: 5000, premium: 15000, luxury: null },
  { id: 27, zone: 'The South of Thailand', distance: '300 km', destination: 'Bangkok - Kui Buri', std: 5100, exec: 5300, premium: null, luxury: null },
  { id: 28, zone: 'The South of Thailand', distance: '265 km', destination: 'Bangkok - Sam Roi Yot', std: 5100, exec: 5300, premium: null, luxury: null },
  { id: 29, zone: 'The South of Thailand', distance: '380 km', destination: 'Bangkok - Bang Saphan', std: 6300, exec: 6500, premium: 26000, luxury: 35000 },
  { id: 30, zone: 'The South of Thailand', distance: '500 km', destination: 'Bangkok - Chumphon', std: 8600, exec: 8800, premium: 25000, luxury: null },
  { id: 31, zone: 'The South of Thailand', distance: '867 km', destination: 'Bangkok - Phuket', std: 17300, exec: 17500, premium: 40000, luxury: 109000 },
  { id: 32, zone: 'The South of Thailand', distance: '710 km', destination: 'Bangkok - Don Sak', std: 18300, exec: 18500, premium: null, luxury: null },
  { id: 33, zone: 'The South of Thailand', distance: '644 km', destination: 'Bangkok - Surat Thani', std: 18300, exec: 18500, premium: null, luxury: null },
  { id: 34, zone: 'The South of Thailand', distance: '946 km', destination: 'Bangkok - Krabi', std: 18300, exec: 18500, premium: null, luxury: null },
  // West
  { id: 35, zone: 'The West of Thailand', distance: '165 km', destination: 'Bangkok - Ratchaburi', std: 3600, exec: 3800, premium: null, luxury: null },
  { id: 36, zone: 'The West of Thailand', distance: '130 km', destination: 'Bangkok - Kanchanaburi', std: 4200, exec: 4400, premium: 11500, luxury: 22000 },
  { id: 37, zone: 'The West of Thailand', distance: '235 km', destination: 'Bangkok - Sai Yok', std: 5600, exec: 5800, premium: null, luxury: null },
  { id: 38, zone: 'The West of Thailand', distance: '380 km', destination: 'Bangkok - Sangkhla Buri', std: 7800, exec: 8000, premium: null, luxury: null },
  // North
  { id: 39, zone: 'The North of Thailand', distance: '76 km', destination: 'Bangkok - Ayutthaya', std: 2900, exec: 3100, premium: 10000, luxury: null },
  { id: 40, zone: 'The North of Thailand', distance: '260 km', destination: 'Bangkok - Nakhon Sawan', std: 4600, exec: 4800, premium: 20900, luxury: null },
  { id: 41, zone: 'The North of Thailand', distance: '350 km', destination: 'Bangkok - Phetchabun', std: 7800, exec: 8000, premium: null, luxury: null },
  { id: 42, zone: 'The North of Thailand', distance: '400 km', destination: 'Bangkok - Phitsanulok', std: 7800, exec: 8000, premium: 17000, luxury: 35000 },
  { id: 43, zone: 'The North of Thailand', distance: '500 km', destination: 'Bangkok - Sukhothai', std: 9800, exec: 10000, premium: null, luxury: 41500 },
  { id: 44, zone: 'The North of Thailand', distance: '519 km', destination: 'Bangkok - Mae Sot - Tak', std: 11300, exec: 11500, premium: 18400, luxury: null },
  { id: 45, zone: 'The North of Thailand', distance: '695 km', destination: 'Bangkok - Chiang Mai', std: 18300, exec: 18500, premium: 34000, luxury: 52000 },
  { id: 46, zone: 'The North of Thailand', distance: '820 km', destination: 'Bangkok - Chiang Rai', std: 20300, exec: 20500, premium: null, luxury: null },
  // Northeast
  { id: 47, zone: 'The Northeast of Thailand', distance: '107 km', destination: 'Bangkok - Saraburi', std: 3300, exec: 3500, premium: null, luxury: null },
  { id: 48, zone: 'The Northeast of Thailand', distance: '165 km', destination: 'Bangkok - Khao Yai', std: 4200, exec: 4400, premium: 10500, luxury: 19500 },
  { id: 49, zone: 'The Northeast of Thailand', distance: '246 km', destination: 'Bangkok - Wang Nam Khiao', std: 4600, exec: 4800, premium: 18000, luxury: null },
  { id: 50, zone: 'The Northeast of Thailand', distance: '299 km', destination: 'Bangkok - Nakhon Ratchasima', std: 4600, exec: 4800, premium: 11500, luxury: 28000 },
  // Hourly
  { id: 51, zone: 'Hourly', distance: '4 Hrs', destination: '04 Hours: Private Van Rental with Driver & Fuel (Max 250 Km.)', std: 3200, exec: 3400, premium: 7500, luxury: 10000 },
  { id: 52, zone: 'Hourly', distance: '6 Hrs', destination: '06 Hours: Private Van Rental with Driver & Fuel (Max 300 Km.)', std: 4600, exec: 4800, premium: 9000, luxury: 16000 },
  { id: 53, zone: 'Hourly', distance: '8 Hrs', destination: '08 Hours: Private Van Rental with Driver & Fuel (Max 350 Km.)', std: 5800, exec: 6000, premium: 12000, luxury: 20000 },
  { id: 54, zone: 'Hourly', distance: '10 Hrs', destination: '10 Hours: Private Van Rental with Driver & Fuel (Max 400 Km.)', std: 7300, exec: 7500, premium: 15000, luxury: 24000 },
  // Period
  { id: 55, zone: 'Period', distance: '1 Day', destination: '01 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 5800, exec: 6000, premium: 12000, luxury: 20000 },
  { id: 56, zone: 'Period', distance: '7 Days', destination: '07 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 39800, exec: 40000, premium: 84000, luxury: null },
  { id: 57, zone: 'Period', distance: '15 Days', destination: '15 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 84800, exec: 85000, premium: 180000, luxury: null },
  { id: 58, zone: 'Period', distance: '30 Days', destination: '30 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 149800, exec: 150000, premium: 350000, luxury: null },
]

const busRoutes = [
  // Airport Transfer
  { id: 1, zone: 'Airport Transfer', distance: '26 km', destination: 'Bangkok - Don Mueang Airport', minibus: 6000, mid: 10000, group: 14000 },
  { id: 2, zone: 'Airport Transfer', distance: '32 km', destination: 'Bangkok - Suvarnabhumi Airport', minibus: 6000, mid: 10000, group: 14000 },
  { id: 3, zone: 'Airport Transfer', distance: '178 km', destination: 'Bangkok - Utapao Airport', minibus: null, mid: 25000, group: 28000 },
  // Central
  { id: 4, zone: 'Central Region', distance: '35 km', destination: 'Bangkok - Nonthaburi', minibus: null, mid: 12000, group: 14000 },
  { id: 5, zone: 'Central Region', distance: '45 km', destination: 'Bangkok - Pathum Thani', minibus: null, mid: 13000, group: 15000 },
  { id: 6, zone: 'Central Region', distance: '51 km', destination: 'Bangkok - Samut Prakan', minibus: null, mid: 12000, group: 14000 },
  { id: 7, zone: 'Central Region', distance: '59 km', destination: 'Bangkok - Samut Sakhon', minibus: null, mid: null, group: null },
  { id: 8, zone: 'Central Region', distance: '69 km', destination: 'Bangkok - Nakhon Pathom', minibus: null, mid: 16000, group: null },
  { id: 9, zone: 'Central Region', distance: '78 km', destination: 'Bangkok - Chachoengsao', minibus: 12000, mid: 19000, group: 23000 },
  // East
  { id: 10, zone: 'The East of Thailand', distance: '100 km', destination: 'Bangkok - Bangsean', minibus: 12000, mid: 20000, group: 24000 },
  { id: 11, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Chon Buri', minibus: 12500, mid: 21000, group: 24000 },
  { id: 12, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Pattaya', minibus: 14000, mid: 23000, group: 25000 },
  { id: 13, zone: 'The East of Thailand', distance: '130 km', destination: 'Bangkok - Laem Chabang', minibus: 12500, mid: 21000, group: 24000 },
  { id: 14, zone: 'The East of Thailand', distance: '200 km', destination: 'Bangkok - Sathahip', minibus: 14000, mid: 23000, group: 25000 },
  { id: 15, zone: 'The East of Thailand', distance: '220 km', destination: 'Bangkok - Rayong', minibus: 16000, mid: 27000, group: 30000 },
  { id: 16, zone: 'The East of Thailand', distance: '242 km', destination: 'Bangkok - Ban Phae Pier', minibus: 16300, mid: 27300, group: 30300 },
  { id: 17, zone: 'The East of Thailand', distance: '275 km', destination: 'Bangkok - Chanthaburi', minibus: 16000, mid: 27000, group: 30000 },
  { id: 18, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Aranyaprathet', minibus: null, mid: null, group: null },
  { id: 19, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Sa Kaeo', minibus: null, mid: null, group: null },
  { id: 20, zone: 'The East of Thailand', distance: '400 km', destination: 'Bangkok - Trat', minibus: 18000, mid: 30000, group: 33000 },
  { id: 21, zone: 'The East of Thailand', distance: '420 km', destination: 'Bangkok - Hat Lek', minibus: null, mid: null, group: null },
  { id: 22, zone: 'The East of Thailand', distance: '450 km', destination: 'Bangkok - Koh Chang', minibus: null, mid: null, group: null },
  // South
  { id: 23, zone: 'The South of Thailand', distance: '99 km', destination: 'Bangkok - Samut Songkhram', minibus: null, mid: 18000, group: null },
  { id: 24, zone: 'The South of Thailand', distance: '200 km', destination: 'Bangkok - Cha-Am', minibus: 12000, mid: 19000, group: 21000 },
  { id: 25, zone: 'The South of Thailand', distance: '220 km', destination: 'Bangkok - Hua Hin', minibus: 14000, mid: 23000, group: 25000 },
  { id: 26, zone: 'The South of Thailand', distance: '245 km', destination: 'Bangkok - Pranburi', minibus: null, mid: null, group: null },
  { id: 27, zone: 'The South of Thailand', distance: '300 km', destination: 'Bangkok - Kui Buri', minibus: null, mid: null, group: null },
  { id: 28, zone: 'The South of Thailand', distance: '265 km', destination: 'Bangkok - Sam Roi Yot', minibus: 5100, mid: 5300, group: null },
  { id: 29, zone: 'The South of Thailand', distance: '380 km', destination: 'Bangkok - Bang Saphan', minibus: null, mid: null, group: null },
  { id: 30, zone: 'The South of Thailand', distance: '500 km', destination: 'Bangkok - Chumphon', minibus: 24000, mid: 40000, group: null },
  { id: 31, zone: 'The South of Thailand', distance: '867 km', destination: 'Bangkok - Phuket', minibus: null, mid: 73000, group: 75000 },
  { id: 32, zone: 'The South of Thailand', distance: '710 km', destination: 'Bangkok - Don Sak', minibus: null, mid: null, group: null },
  { id: 33, zone: 'The South of Thailand', distance: '644 km', destination: 'Bangkok - Surat Thani', minibus: null, mid: 42000, group: null },
  { id: 34, zone: 'The South of Thailand', distance: '946 km', destination: 'Bangkok - Krabi', minibus: null, mid: 52000, group: null },
  // West
  { id: 35, zone: 'The West of Thailand', distance: '165 km', destination: 'Bangkok - Ratchaburi', minibus: null, mid: 20000, group: null },
  { id: 36, zone: 'The West of Thailand', distance: '130 km', destination: 'Bangkok - Kanchanaburi', minibus: 15000, mid: 25000, group: null },
  { id: 37, zone: 'The West of Thailand', distance: '235 km', destination: 'Bangkok - Sai Yok', minibus: null, mid: null, group: null },
  { id: 38, zone: 'The West of Thailand', distance: '380 km', destination: 'Bangkok - Sangkhla Buri', minibus: null, mid: null, group: null },
  // North
  { id: 39, zone: 'The North of Thailand', distance: '76 km', destination: 'Bangkok - Ayutthaya', minibus: 10000, mid: 16000, group: 20000 },
  { id: 40, zone: 'The North of Thailand', distance: '260 km', destination: 'Bangkok - Nakhon Sawan', minibus: null, mid: 25000, group: null },
  { id: 41, zone: 'The North of Thailand', distance: '350 km', destination: 'Bangkok - Phetchabun', minibus: null, mid: null, group: null },
  { id: 42, zone: 'The North of Thailand', distance: '400 km', destination: 'Bangkok - Phitsanulok', minibus: null, mid: 29000, group: null },
  { id: 43, zone: 'The North of Thailand', distance: '500 km', destination: 'Bangkok - Sukhothai', minibus: null, mid: 36000, group: null },
  { id: 44, zone: 'The North of Thailand', distance: '519 km', destination: 'Bangkok - Mae Sot - Tak', minibus: null, mid: null, group: null },
  { id: 45, zone: 'The North of Thailand', distance: '695 km', destination: 'Bangkok - Chiang Mai', minibus: 32000, mid: 52000, group: null },
  { id: 46, zone: 'The North of Thailand', distance: '820 km', destination: 'Bangkok - Chiang Rai', minibus: null, mid: null, group: null },
  // Northeast
  { id: 47, zone: 'The Northeast of Thailand', distance: '107 km', destination: 'Bangkok - Saraburi', minibus: null, mid: 21500, group: null },
  { id: 48, zone: 'The Northeast of Thailand', distance: '165 km', destination: 'Bangkok - Khao Yai', minibus: 14000, mid: 23000, group: null },
  { id: 49, zone: 'The Northeast of Thailand', distance: '246 km', destination: 'Bangkok - Wang Nam Khiao', minibus: null, mid: null, group: null },
  { id: 50, zone: 'The Northeast of Thailand', distance: '299 km', destination: 'Bangkok - Nakhon Ratchasima', minibus: null, mid: 25000, group: null },
  // Hourly
  { id: 51, zone: 'Hourly', distance: '4 Hrs', destination: '04 Hours: Private Bus Rental with Driver & Fuel (Max 250 Km.)', minibus: 12000, mid: 20000, group: 28000 },
  { id: 52, zone: 'Hourly', distance: '6 Hrs', destination: '06 Hours: Private Bus Rental with Driver & Fuel (Max 300 Km.)', minibus: 18000, mid: 30000, group: 38000 },
  { id: 53, zone: 'Hourly', distance: '8 Hrs', destination: '08 Hours: Private Bus Rental with Driver & Fuel (Max 350 Km.)', minibus: 21000, mid: 35000, group: 50000 },
  { id: 54, zone: 'Hourly', distance: '10 Hrs', destination: '10 Hours: Private Bus Rental with Driver & Fuel (Max 400 Km.)', minibus: 27000, mid: 45000, group: 65000 },
  // Period
  { id: 55, zone: 'Period', distance: '1 Day', destination: '01 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: 21000, mid: 35000, group: 50000 },
  { id: 56, zone: 'Period', distance: '7 Days', destination: '07 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: null, mid: null, group: null },
  { id: 57, zone: 'Period', distance: '15 Days', destination: '15 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: null, mid: null, group: null },
  { id: 58, zone: 'Period', distance: '30 Days', destination: '30 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: null, mid: null, group: null },
]

const zones = ['Airport Transfer', 'Central Region', 'The East of Thailand', 'The South of Thailand', 'The West of Thailand', 'The North of Thailand', 'The Northeast of Thailand', 'Hourly', 'Period']

const fmt = (v) => v ? `฿${v.toLocaleString()}` : 'N/A'

const zoneColor = (zone) => {
  const map = {
    'Airport Transfer': 'bg-blue-100 text-blue-800',
    'Central Region': 'bg-green-100 text-green-800',
    'The East of Thailand': 'bg-orange-100 text-orange-800',
    'The South of Thailand': 'bg-cyan-100 text-cyan-800',
    'The West of Thailand': 'bg-purple-100 text-purple-800',
    'The North of Thailand': 'bg-indigo-100 text-indigo-800',
    'The Northeast of Thailand': 'bg-yellow-100 text-yellow-800',
    'Hourly': 'bg-pink-100 text-pink-800',
    'Period': 'bg-red-100 text-red-800',
  }
  return map[zone] || 'bg-gray-100 text-gray-800'
}

export default function AllRoutes() {
  const [vehicleTab, setVehicleTab] = useState('car')
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editRoute, setEditRoute] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const { toast } = useToast()

  const openEdit = (r) => {
    setEditRoute(r)
    setEditForm({ destination: r.destination, zone: r.zone, distance: r.distance })
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    setIsSavingEdit(true)
    setTimeout(() => {
      setIsSavingEdit(false)
      setIsEditOpen(false)
      toast({ title: 'Route Updated', description: `Route ${editForm.destination || editRoute?.destination} updated successfully` })
    }, 700)
  }

  const sourceData = vehicleTab === 'car' ? carRoutes : vehicleTab === 'van' ? vanRoutes : busRoutes

  const filtered = sourceData.filter(r => {
    const matchSearch = r.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.zone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchZone = zoneFilter === 'all' || r.zone === zoneFilter
    return matchSearch && matchZone
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 600))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Route data updated' })
  }

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Route list is being exported' })
  }

  const openDetails = (route) => {
    setSelectedRoute(route)
    setIsDetailsOpen(true)
  }

  const totalCar = carRoutes.length
  const totalVan = vanRoutes.length
  const totalBus = busRoutes.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Routes</h1>
          <p className="text-muted-foreground mt-2">Complete route list from ibbservice.com — real pricing data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Car className="h-4 w-4 text-blue-500" /> Car & SUV Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCar}</div>
            <p className="text-xs text-muted-foreground">Standard / Executive / Family / Electric / Limousine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Route className="h-4 w-4 text-green-500" /> MPV/Van Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVan}</div>
            <p className="text-xs text-muted-foreground">Standard / Executive / Premium / Luxury</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bus className="h-4 w-4 text-orange-500" /> BUS/Coach Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBus}</div>
            <p className="text-xs text-muted-foreground">Minibus / Mid-sized / Group Bus</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Type Tabs */}
      <div className="flex gap-2">
        {[{key:'car',label:'🚗 Car & SUV'},{key:'van',label:'🚐 MPV/Van'},{key:'bus',label:'🚌 BUS/Coach'}].map(t => (
          <button
            key={t.key}
            onClick={() => { setVehicleTab(t.key); setCurrentPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              vehicleTab === t.key
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destination or zone..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="pl-9"
          />
        </div>
        <Select value={zoneFilter} onValueChange={v => { setZoneFilter(v); setCurrentPage(1) }}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All Zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Distance</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Destination</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Zone</th>
                  {vehicleTab === 'car' && <>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Standard</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Executive</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Family</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Electric</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Limo Premium</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Limo Luxury</th>
                  </>}
                  {vehicleTab === 'van' && <>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Standard</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Executive</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Premium</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Luxury</th>
                  </>}
                  {vehicleTab === 'bus' && <>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Minibus</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Mid-sized</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Group Bus</th>
                  </>}
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-4 text-muted-foreground text-xs">{r.distance}</td>
                    <td className="py-2 px-4 font-medium max-w-[280px]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{r.destination}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <Badge className={`text-xs ${zoneColor(r.zone)}`}>{r.zone}</Badge>
                    </td>
                    {vehicleTab === 'car' && <>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.std)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.exec)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.family)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.electric)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.limo_premium)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.limo_luxury)}</td>
                    </>}
                    {vehicleTab === 'van' && <>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.std)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.exec)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.premium)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.luxury)}</td>
                    </>}
                    {vehicleTab === 'bus' && <>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.minibus)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.mid)}</td>
                      <td className="py-2 px-4 text-right text-xs">{fmt(r.group)}</td>
                    </>}
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openDetails(r)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(r)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} routes
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" /><ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">{currentPage} / {totalPages}</span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" /><ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Route Details
            </DialogTitle>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-semibold">{selectedRoute.destination}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Zone</p>
                  <Badge className={`text-xs mt-1 ${zoneColor(selectedRoute.zone)}`}>{selectedRoute.zone}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-medium">{selectedRoute.distance}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Pricing</p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                  {vehicleTab === 'car' && <>
                    <div className="flex justify-between"><span>Standard</span><span className="font-medium">{fmt(selectedRoute.std)}</span></div>
                    <div className="flex justify-between"><span>Executive</span><span className="font-medium">{fmt(selectedRoute.exec)}</span></div>
                    <div className="flex justify-between"><span>Family</span><span className="font-medium">{fmt(selectedRoute.family)}</span></div>
                    <div className="flex justify-between"><span>Electric</span><span className="font-medium">{fmt(selectedRoute.electric)}</span></div>
                    <div className="flex justify-between"><span>Limousine Premium</span><span className="font-medium">{fmt(selectedRoute.limo_premium)}</span></div>
                    <div className="flex justify-between"><span>Limousine Luxury</span><span className="font-medium">{fmt(selectedRoute.limo_luxury)}</span></div>
                  </>}
                  {vehicleTab === 'van' && <>
                    <div className="flex justify-between"><span>Standard</span><span className="font-medium">{fmt(selectedRoute.std)}</span></div>
                    <div className="flex justify-between"><span>Executive</span><span className="font-medium">{fmt(selectedRoute.exec)}</span></div>
                    <div className="flex justify-between"><span>Premium</span><span className="font-medium">{fmt(selectedRoute.premium)}</span></div>
                    <div className="flex justify-between"><span>Luxury</span><span className="font-medium">{fmt(selectedRoute.luxury)}</span></div>
                  </>}
                  {vehicleTab === 'bus' && <>
                    <div className="flex justify-between"><span>Minibus</span><span className="font-medium">{fmt(selectedRoute.minibus)}</span></div>
                    <div className="flex justify-between"><span>Mid-sized</span><span className="font-medium">{fmt(selectedRoute.mid)}</span></div>
                    <div className="flex justify-between"><span>Group Bus</span><span className="font-medium">{fmt(selectedRoute.group)}</span></div>
                  </>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Route Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
          </DialogHeader>
          {editRoute && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Destination</label>
                <Input value={editForm.destination || ''} onChange={e => setEditForm(f => ({...f, destination: e.target.value}))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Zone</label>
                <Input value={editForm.zone || ''} onChange={e => setEditForm(f => ({...f, zone: e.target.value}))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Distance</label>
                <Input value={editForm.distance || ''} onChange={e => setEditForm(f => ({...f, distance: e.target.value}))} className="mt-1" />
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)} disabled={isSavingEdit}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveEdit} disabled={isSavingEdit}>
              {isSavingEdit ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
