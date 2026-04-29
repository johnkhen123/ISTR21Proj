import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all orders for user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single order
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(404).json({ success: false, error: 'Order not found' });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { user_id, items, total_amount, shipping_address, status } = req.body;
    
    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order data' });
    }
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id,
        total_amount,
        shipping_address,
        status: status || 'pending',
        created_at: new Date()
      }])
      .select();
    
    if (orderError) throw orderError;
    
    const orderId = order[0].id;
    
    // Add order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    res.status(201).json({ 
      success: true, 
      data: { ...order[0], order_items: orderItems }
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update order status
router.patch('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, data: data[0] });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
