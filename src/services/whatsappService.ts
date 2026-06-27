import { Linking, Alert } from 'react-native';
import { buildOrderMessage, buildChangeMessage, buildCancelMessage } from '../utils/messageTemplates';
import { MealType, OrderStatus } from '../types';
import { MEAL_LABELS } from '../utils/constants';

export const openWhatsApp = async (phone: string, message: string): Promise<boolean> => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  try {
    await Linking.openURL(url);
    return true;
  } catch (error) {
    Alert.alert('Error', 'Failed to open WhatsApp. Is it installed?');
    return false;
  }
};

export const sendTiffinMessage = async (
  vendorName: string,
  vendorPhone: string,
  mealType: MealType,
  location: string,
  status: OrderStatus,
): Promise<boolean> => {
  let message: string;
  switch (status) {
    case 'ordered':
      message = buildOrderMessage(vendorName, MEAL_LABELS[mealType], location);
      break;
    case 'changed':
      message = buildChangeMessage(vendorName, MEAL_LABELS[mealType], location);
      break;
    case 'skipped':
      message = buildCancelMessage(vendorName);
      break;
    default:
      message = buildOrderMessage(vendorName, MEAL_LABELS[mealType], location);
  }
  return openWhatsApp(vendorPhone, message);
};