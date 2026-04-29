import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, sort, limit = 20, offset = 0 } = req.query;
    
    let query = supabase.from('products').select('*');
    
    if (category) query = query.eq('category', category);
    
    if (sort === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(404).json({ success: false, error: 'Product not found' });
  }
});

// Create product (admin)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ success: false, error: 'Name and price required' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        price,
        category,
        image_url,
        stock: stock || 0,
        created_at: new Date()
      }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update product (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, data: data[0] });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete product (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
